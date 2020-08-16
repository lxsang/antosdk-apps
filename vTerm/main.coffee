# Copyright 2017-2018 Xuan Sang LE <xsang.le AT gmail DOT com>

# AnTOS Web desktop is is licensed under the GNU General Public
# License v3.0, see the LICENCE file for more information

# This program is free software: you can redistribute it and/or
# modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation, either version 3 of 
# the License, or (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.

# You should have received a copy of the GNU General Public License
#along with this program. If not, see https://www.gnu.org/licenses/

class vTerm extends this.OS.application.BaseApplication
    constructor: (args) ->
        super "vTerm", args
    
    main: () ->
        @mterm = @find "myterm"
        @term = new Terminal { cursorBlink: true }
        @fitAddon = new FitAddon.FitAddon()
        @term.loadAddon(@fitAddon)
        @term.setOption('fontSize', '12')
        @term.open @mterm
        @sub = undefined
        @term.onKey (d) =>
            return unless @sub
            @sub.send Antunnel.Msg.DATA, new TextEncoder("utf-8").encode(d.key)

        @on "focus", () => @term.focus()
        
        @mterm.contextmenuHandle = (e, m) =>
            m.items = [
                { text: "__(Copy)", id: "copy" },
                { text: "__(Paste)", id: "paste"}
            ]
            m.onmenuselect = (e) =>
                return unless e
                @mctxHandle e.data.item.data
            m.show e
        @resizeContent()
        # make desktop menu if not exist
        @systemsetting.desktop.menu[@name] = { text: "__(Open terminal)", app: "vTerm" } unless @systemsetting.desktop.menu[@name]
        
        @on "hboxchange", (e) =>
            @resizeContent()
        
        
        checklib = () =>
            if not Antunnel.tunnel
                @error __("The Antunnel service is not started, please start it first")
                @_gui.pushService("Antunnel/AntunnelService")
                .catch (e) =>
                    @error e.toString(), e
                @quit()
            else
                @tunnel = Antunnel.tunnel
                @openSession()
        
        if not window.Antunnel
            console.log "require Antunnel"
            @_api.requires("pkg://Antunnel/main.js").then () =>
                checklib()
            .catch (e) =>
                @error __("Unable to load Antunnel: {0}",e.toString()), e
                @quit()
        else
            checklib()

    mctxHandle: (data) ->
        switch data.id
            when "paste"
                @_api.getClipboard().then (text) =>
                    return unless text and text isnt ""
                    @sub.send Antunnel.Msg.DATA, new TextEncoder("utf-8").encode(text) if @sub
                .catch (e) => @error __("Unable to paste"), e
            when "copy"
                text = @term.getSelection()
                return unless text and text isnt ""
                @_api.setClipboard text
            else
    

    resizeContent: () ->
        @fitAddon.fit()
        ncol = @term.cols
        nrow = @term.rows
        return unless @sub
        arr = new Uint8Array(8)
        arr.set Antunnel.Msg.bytes_of(ncol), 0
        arr.set Antunnel.Msg.bytes_of(nrow), 4
        @sub.send Antunnel.Msg.CTRL, arr

    openSession: () ->
        @term.clear()
        @term.focus()
        @sub = new Antunnel.Subscriber("vterm")
        @sub.onopen = () =>
            console.log("Subscribed")
            @resizeContent (($ @mterm).width()) ,  (($ @mterm).height())
            @term.focus()
        
        @sub.onerror = (e) =>
            @error __("Unable to connect to: vterm"), e
            @sub = undefined

        @sub.onmessage =  (e) =>
            @term.write(new TextDecoder("utf-8").decode(e.data)) if @term and e.data
        
        @sub.onclose = () =>
            @sub = undefined
            @notify __("Terminal connection closed")
            @quit()
        
        @tunnel.subscribe @sub

    cleanup: (e) ->
        @sub.close() if @sub

this.OS.register "vTerm", vTerm