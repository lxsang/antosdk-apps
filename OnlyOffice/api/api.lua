local args=...
local vfs = require("vfs")

if not args then
    args = REQUEST
end

local result = function(data)
    return {
        error = false,
        result = data
    }
end

local error = function(data)
    return {
        error = data,
        result = false
    }
end

local download_file = function(src, dest)
    local https = require('ssl.https')
    local ltn12 = require("ltn12")
    local file = io.open(dest, "w")
    if not file then
        LOG_ERROR("Unable to open file %s to write", dest)
        return false
    end
    local body, code, headers = https.request{
        url = src,
        sink = ltn12.sink.file(file)
    }
    if code~=200 then 
        LOG_ERROR("Error: ".. (code or '') ) 
        return false
    end
    return true
end

local handle = {}

handle.token = function(data)
    local file = vfs.ospath(data.file)
    local stat = ulib.file_stat(file)
    local ret = {
        sid = "sessionid="..SESSION.sessionid,
        key = enc.sha1(file..":"..stat.mtime)
    }
    return result(ret)
end

handle.history = function(data)
    local file = vfs.ospath(data.file)
    local history_file = vfs.ospath("home://.office/"..enc.sha1(file).."/history.json")
    if(ulib.exists(history_file)) then
        local obj = JSON.decodeFile(history_file)
        obj.hash = enc.sha1(file)
        return result(obj)
    else
        return error("No history found")
    end
end
handle.clean_up_version = function(basepath, h,v)
    if not h then
        return nil
    end
    if h.version == v then
        return h
    else
        --delete this version
        local cmd = 'rm '..basepath.."/"..h.key.."*"
        print(cmd)
        os.execute(cmd)
        if h.previous then
            return handle.clean_up_version(basepath, h.previous,v)
        else
            return nil
        end
    end
end
handle.restore = function(data)
    local version = data.version
    local file = vfs.ospath(data.file)
    local basepath = vfs.ospath("home://.office/"..enc.sha1(file))
    if ulib.exists(basepath.."/history.json") then
        local history = JSON.decodeFile(basepath.."/history.json")
        local obj = handle.clean_up_version(basepath, history,version)
        if obj then
            -- restore the file
            local cmd = 'cp '..basepath.."/"..obj.key..' "'..file..'"'
            os.execute(cmd)
            local cmd = 'rm '..basepath.."/"..obj.key
            os.execute(cmd)
            
            local f = io.open(basepath.."/history.json", "w")
            if f then
                f:write(JSON.encode(obj))
                f:close()
                return result("File restored")
            else
                return error("Cannot save history")
            end
        else
            local cmd = "rm "..basepath.."/history.json"
            os.execute(cmd)
            return result("File restored")
        end
    else
        return error("Unable to restore: no history meta-data found")
    end
    
end
handle.duplicate = function(data)
    local file = vfs.ospath(data.as)
    download_file(data.remote, file)
    if not ulib.exists(file) then
        return error("Unable to duplicate file")
    end
    return result("File duplicated")
end

handle.save = function()
    if not REQUEST.json then
        return error("Invalid request")
    end
    local data = JSON.decodeString(REQUEST.json)
    if not data then
        return error("Invalid request")
    end
    if not REQUEST.file then
        return error("No file found")
    end
    local file = vfs.ospath(REQUEST.file)
    if data.status == 2 then
        local tmpfile = "/tmp/"..enc.sha1(file)
        download_file(data.url, tmpfile)
        -- move file to correct position
        if ulib.exists(tmpfile) then
            LOG_INFO("Remote file saved to %s", tmpfile)
            -- back up the file version
            local history_dir = "home://.office"
            vfs.mkdir(history_dir)
            history_dir = history_dir.."/"..enc.sha1(file)
            vfs.mkdir(history_dir)
            history_dir = vfs.ospath(history_dir)
            -- backup old version
            ulib.send_file(file,history_dir.."/"..data.key)
            LOG_INFO("Backup file saved to %s", history_dir.."/"..data.key)
            -- create new version
            local old_stat = ulib.file_stat(file)
            if not ulib.move(tmpfile, file) then
                ulib.send_file(tmpfile, file)
            end
            -- get the new key
            local stat = ulib.file_stat(file)
            local new_key = enc.sha1(file..":"..stat.mtime)
            -- save changes
            if(data.changesurl) then
                download_file(data.changesurl, history_dir.."/"..new_key..'.zip')
            end
            -- now save version object
            local history_file = history_dir.."/history.json"
            local history = {}
            if ulib.exists(history_file) then
                history.previous = JSON.decodeFile(history_file)
                history.version = history.previous.version + 1
            else
                history.version = 1
                history.previous = {
                    key = data.key,
                    version = 0,
                    create = old_stat.mtime
                }
            end
            history.key = new_key
            history.changes = data.history.changes
            history.serverVersion = data.history.serverVersion
            history.create = stat.mtime
            history.user = { id = ulib.uid(SESSION.user).id, name = SESSION.user }
            -- save the history to file
            local f = io.open(history_file, "w")
            if f then
                f:write(JSON.encode(history))
                f:close()
                
            else
                return error("Cannot save history")
            end
            LOG_INFO("File "..file.." sync with remote")
        else
            return error("Unable to download")
        end
    end
    
    return result("OK")
end

--print(JSON.encode(args))

if args.action and handle[args.action] then
    return handle[args.action](args.args)
else
    return error("Invalid action parameter")
end