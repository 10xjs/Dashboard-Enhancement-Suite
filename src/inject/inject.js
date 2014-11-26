function loadFile(url, callback) {
    // console.log('load file')
    return new Promise(function (fulfill, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET",url)
        function onerror() {
            reject('loadFile(): GET '+ xhr.responseURL + ' ' + xhr.status + ' (' + xhr.statusText + ')')
        }
        function onload() {
            if ( xhr.status === 200 ) {
                fulfill(xhr.response)
            } else {
                onerror.apply(xhr, arguments)
            }
        }
        xhr.onload = onload
        xhr.onerror = onerror
        xhr.send()
    })
}

// loadFile(chrome.extension.getURL('src/data/contacts.json'))
// .then(function (data) {
//     console.log('data')
//     return loadFile('test.html')
// }, function (reason) {
//     console.error(reason)
// })
// .then(function (data) {
//     console.log('data')
// }, function (reason) {
//     console.error(reason)
// })


// async.js

var contacts = [
    {
        firstName: 'Alan',
        lastName: 'Pugh',
        shortName: 'Alan P.',
        email: 'apugh@caorda.com'
    },
    {
        firstName: 'Eric',
        lastName: 'McNiece',
        shortName: 'Eric M.',
        email: 'emcniece@caorda.com'
    },
    {
        firstName: 'Hilary',
        lastName: 'Tabbernor',
        shortName: 'Hilary T.',
        email: 'htabbernor@caorda.com'
    },
    {
        firstName: 'Jeremy',
        lastName: 'Snell',
        shortName: 'Jeremy S.',
        email: 'jsnell@caorda.com'
    },
    {
        firstName: 'Lance',
        lastName: 'Hesketh',
        shortName: 'Lance H.',
        email: 'lhesketh@caorda.com'
    },
    {
        firstName: 'Lorne',
        lastName: 'Neil',
        shortName: 'Lorne N.',
        email: 'lneil@caorda.com'
    },
    {
        firstName: 'Max',
        lastName: 'Dumonceaux',
        shortName: 'Max D.',
        email: 'mdumonceaux@caorda.com'
    },
    {
        firstName: 'Neal',
        lastName: 'Granger',
        shortName: 'Neal G.',
        email: 'ngranger@caorda.com'
    },
    {
        firstName: 'Rauvy',
        lastName: 'Dalep',
        shortName: 'Rauvy D.',
        email: 'rdalep@caorda.com'
    },
    {
        firstName: 'Renee',
        lastName: 'Bush',
        shortName: 'Renee B.',
        email: 'rbush@caorda.com'
    },
    {
        firstName: 'Ryan',
        lastName: 'Morben',
        shortName: 'Ryan M.',
        email: 'rmorben@caorda.com'
    },
    {
        firstName: 'Mark',
        lastName: 'Nahirny',
        shortName: 'Mark N.',
        email: 'mnahirny@caorda.com'
    },
    {
        firstName: 'Robert',
        lastName: 'Regimbald',
        shortName: 'Robert R.',
        email: 'rregimbald@caorda.com'
    },
    {
        firstName: 'Support',
        lastName: 'Queue',
        shortName: 'Support Q.',
        email: 'support@caorda.com'
    },
    {
        firstName: 'Paul',
        lastName: 'Johnston',
        shortName: 'Paul J.',
        email: 'pjohnston@caorda.com'
    }
]

// function Extension() {}

// Extension.prototype.loadFileAsync = function(first_argument) {
//     // body...
// };

// Extention.prototype.init = function(first_argument) {
//     // body...
// };


var registerTemplate = function(name) {
    var file = chrome.extension.getURL('src/views/' + name + '.html')
    $.when($.get(file))
    .done(function (data) {
        $.templates(name, data)
        initExtension()
    })
}
registerTemplate('tasktable')

// $.templates('tasktable','<div class="foundation"><table class="fullwidth table-fixed"><caption>Assigned Tasks</caption><thead><tr><th style="width: 30px;"></th><th style="width: 110px;">Created</th><th style="width: 110px;">Due</th><th>Client</th><th>Title</th><th style="width: 110px;">Owner</th><th style="width: 60px;">Priority</th><th style="width: 60px;">Status</th><th style="width: 40px;"></th></tr</thead><tbody>{{for tasks}}<tr data-href="https://apps.caorda.com/dashboard/tasks/tasks.aspx?Action=LoadTask&TaskID={{:id}}"><td>{{:number}}</td><td>{{:created}}</td><td>{{:due}}</td><td>{{:clientName}} <a href="https://apps.caorda.com/dashboard/domains.aspx?DomainID={{:clientId}}" class="cell-action"><i class="fa fa-caret-right"></i></a></td><td>{{:name}}</td><td>{{:owner}}<a href="{{:emailLink}}" class="cell-action"><i class="fa fa-caret-right"></i></a></td><td style="text-align: center;"><span class="label warning round"><i class="fa fa-dot-circle-o"></i></span></td><td style="text-align: center;"><i class="fa fa-pause"></i></td><td class="button-cell"><a href="#" class="button"><i class="fa fa-caret-right"></i></a></td></tr>{{/for}}</tbody></table></div>')


// if(window.location.protocol != 'https:') {
//   location.href = location.href.replace("http://", "https://");
// }

function initExtension(){
    $(document).ready(function () {
        // console.log('ready')

        var toolbarToggled = parseInt(localStorage.getItem('caorda-dashboard-static-toolbar'),10)

        if(_.isNaN(toolbarToggled)) {
            toolbarToggled = 1;
        }

        localStorage.setItem('caorda-dashboard-static-toolbar',toolbarToggled)

        var $toolbar = $('#divToolbar')

        var $toggle = $('<div id="divToolbarToggle" title="Toggle Static Toolbar">')

        $toolbar.prepend($toggle)

        $toggle.on('click',function (e) {
            if(toolbarToggled) {
                toolbarToggled = 0
            } else {
                toolbarToggled = 1
            }
            localStorage.setItem('caorda-dashboard-static-toolbar',toolbarToggled)
            updateToolbar()
        })

        function updateToolbar() {
            if(toolbarToggled) {
                $('body').addClass('staticToolbar')
            } else {
                $('body').removeClass('staticToolbar')
            }
        }
        updateToolbar()




        function setTaskMeta(metaTitle, id, value, callback) {
            var key = 'taskmeta-' + metaTitle + '-' + id,
            data = {}

            data[key] = value
       
            chrome.storage.sync.set(data,function () {
                // console.log('set meta',key,value)
                typeof callback === 'function' && callback(data)
            })
        }

        function getTaskMeta(metaTitle, id, callback) {
            var key = 'taskmeta-' + metaTitle + '-' + id;
            chrome.storage.sync.get(key, function (data) {
                // console.log('get meta',key,data[key])
                callback(data[key])
            })
        }

        var modalCreateTimeObserver = new MutationObserver(function(mutations) {
            if(! $('#RadWindowWrapper_ctl00_plcContentPlaceHolder_radWindowCreateTaskTimeDialog:visible')[0]) {
                return
            }
            return onCreateTimeModalLoaded(currentTask)
        })

        var modalViewTimesObserver = new MutationObserver(function(mutations) {
            if(! $('#RadWindowWrapper_ctl00_plcContentPlaceHolder_radWindowViewTaskTimesDialog:visible')[0]) {
                return
            }

            var $message = $('#ctl00_plcContentPlaceHolder_radWindowViewTaskTimesDialog_C_ctrlViewTaskTimesControl_lblMessage')

            if ($message.text().indexOf('Update') === 0) {
                return onEditTimeModalLoaded(currentTask)
            }

            if ($message.text().indexOf('These') === 0) {
                return onListTimeModalLoaded(currentTask)
            }
        })

        var formObsrever = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var target
                if(mutation.addedNodes[0]) {
                    if(mutation.addedNodes[0].id === 'RadWindowWrapper_ctl00_plcContentPlaceHolder_radWindowAssignTaskDialog') {
                        $(mutation.addedNodes[0]).find('iframe').on('load', onAssignTaskModalLoaded)

                        console.log('assign')

                    } else if(mutation.addedNodes[0].id === 'RadWindowWrapper_ctl00_plcContentPlaceHolder_radWindowCreateTaskTimeDialog') {
                        target = document.getElementById(('ctl00_plcContentPlaceHolder_ctl00_plcContentPlaceHolder_radWindowCreateTaskTimeDialog_C_ctrlCreateTaskTimeControlPanel'))
                        
                        console.log('create')
                        modalCreateTimeObserver.observe(target, {childList: true})

                    } else if(mutation.addedNodes[0].id === 'RadWindowWrapper_ctl00_plcContentPlaceHolder_radWindowViewTaskTimesDialog') {
                        target = document.getElementById('ctl00_plcContentPlaceHolder_ctl00_plcContentPlaceHolder_radWindowViewTaskTimesDialog_C_ctrlViewTaskTimesControlPanel')
                        console.log('view')
                        modalViewTimesObserver.observe(target, {childList: true})
                    }     
                } 
            })
        })
        
        function getTimeDifference() {
            var loggedHours = JSON.parse(localStorage.getItem('loggedHours')),
            loggedMinutes = JSON.parse(localStorage.getItem('loggedMinutes')),

            workedHours = JSON.parse(localStorage.getItem('workedHours')),
            workedMinutes = JSON.parse(localStorage.getItem('workedMinutes')),

            diffHours = Math.max(workedHours - loggedHours, 0),
            diffMinutes = workedMinutes -loggedMinutes





            if(diffMinutes < 0 ) {
                if(diffHours > 0) {
                    diffMinutes = 60 + diffMinutes
                    diffHours--
                } else {
                    diffMinutes = 0
                }
            }

            return {
                hours:diffHours,
                minutes:diffMinutes
            }
        }
        
        function onCreateTimeModalLoaded (task) {
            console.log('onCreateTimeModalLoaded')

            var $chkAllowNonBillable = $('<input type="checkbox">'),
            $btnFillBillable = $('<button><i class="fa fa-chevron-right"></i></button>'),
            $btnFillNonBillable = $('<button><i class="fa fa-chevron-right"></i></button>'),
            $workType = $('#ctl00_plcContentPlaceHolder_radWindowCreateTaskTimeDialog_C_ctrlCreateTaskTimeControl_selWorkTypeID'),
            $inputsBillable = $('[id^="ctl00_plcContentPlaceHolder_radWindowCreateTaskTimeDialog_C_ctrlCreateTaskTimeControl_txtBillable"]'),
            $inputsNonBillable = $('[id^="ctl00_plcContentPlaceHolder_radWindowCreateTaskTimeDialog_C_ctrlCreateTaskTimeControl_txtNonBillable"]'),
            
            updateNonBillable = function () {
                var checked = $chkAllowNonBillable.prop('checked'),
                workType = $workType.val()

                chrome.storage.sync.set({'allow-non-billable-time':checked},function (){})


                console.log('workType',workType)

                if(workType === '0' ){
                    return
                }

                if(workType === '12' || checked) {
                    $inputsNonBillable.prop('disabled',false)
                } else {
                    $inputsNonBillable.prop('disabled',true)
                }
            }

            function autoFillTime(inputHours,inputMinutes) {
                var newTime = getTimeDifference()
                $inputsBillable.val('')
                $inputsNonBillable.val('')
                inputHours.value = newTime.hours || ''
                inputMinutes.value = newTime.minutes || ''
            }

            $btnFillBillable.on('click', function (e) {
                if( !$inputsBillable.prop('disabled') ) {
                    autoFillTime($inputsBillable[0],$inputsBillable[1])
                }
                e.preventDefault()
                e.stopPropagation()
            })

            $btnFillNonBillable.on('click', function (e) {
                if( !$inputsNonBillable.prop('disabled') ) {
                    autoFillTime($inputsNonBillable[0],$inputsNonBillable[1])
                }
                e.preventDefault()
                e.stopPropagation()
            })

            $inputsBillable.parent().parent().prepend($btnFillBillable)
            $inputsNonBillable.parent().parent().prepend($btnFillNonBillable)


            chrome.storage.sync.get('allow-non-billable-time',function (data) {

                var checked = data['allow-non-billable-time']

                $chkAllowNonBillable.prop('checked',checked)

                $workType.parent().append($('<label>&nbsp;allow non-billble time</label>').prepend($chkAllowNonBillable))

                $chkAllowNonBillable.on('change', function (e) {
                    updateNonBillable()
                })

                updateNonBillable()
            })
        }

        function onListTimeModalLoaded (task) {
            // console.log('onListTimeModalLoaded',task.title)
        }

        function onEditTimeModalLoaded (task) {
            var $inputAllowNonBillable = $('<input type="checkbox">'),
            $workType = $('#ctl00_plcContentPlaceHolder_radWindowViewTaskTimesDialog_C_ctrlViewTaskTimesControl_selWorkTypeID'),
            $inputsNonBillable = $('[id^="ctl00_plcContentPlaceHolder_radWindowViewTaskTimesDialog_C_ctrlViewTaskTimesControl_txtNonBillable"]'),
            
            updateNonBillable = function () {
                var checked = $inputAllowNonBillable.prop('checked'),
                workType = $workType.val()

                chrome.storage.sync.set({'allow-non-billable-time':checked},function (){})


                console.log('workType',workType)

                if(workType == 0 ){
                    return
                }

                if(workType == 12 || checked) {
                    $inputsNonBillable.prop('disabled',false)
                } else {
                    $inputsNonBillable.prop('disabled',true)
                }
            }

            chrome.storage.sync.get('allow-non-billable-time',function (data) {

                var checked = data['allow-non-billable-time']

                $inputAllowNonBillable.prop('checked',checked)

                $workType.parent().append($('<label>&nbsp;allow non-billble time</label>').prepend($inputAllowNonBillable))

                $inputAllowNonBillable.on('change', function (e) {
                    updateNonBillable()
                })

                updateNonBillable()
            })
        }

        if(location.href.match('apps.caorda.com/dashboard/tasks/tasks.aspx')) {

            var aspnetForm = document.getElementById("aspnetForm")


            var taskId = $.trim($('#ctl00_plcContentPlaceHolder_pnlProperties > .clsContainer:nth-child(3) > table > tbody > tr:first-child > td:nth-child(6)').text())
            if(taskId) {
                setTaskMeta('visited',taskId,true)

                var $button = $('<a class="clsButton clsSmall clsBlue" style="display:inline-block;width:100px;">Mark as Unread</a>')
                $('#ctl00_plcContentPlaceHolder_pnlProperties > .clsContainer:nth-child(3) > table > tbody > tr:first-child > td:nth-child(6)').append($button)
                
                $button.on('click', function (e) {

                    setTaskMeta('visited',taskId,false)
                    document.location = 'https://apps.caorda.com/dashboard/tasks/tasklist.aspx'

                    e.preventDefault()
                })
            }


            var $editor = $('#ctl00_plcContentPlaceHolder_radEditorDescription')

            $editor.hide()

            var $textarea = $('#ctl00_plcContentPlaceHolder_radEditorDescriptionContentHiddenTextarea')


            var $description = $('<div id="description-display">')

            description = decodeURIComponent($textarea[0].value)

            linker = AutoLinker()

            description = linker.link(description,{className: "autolinked", newWindow: true})

            $description.html(description).find('a').attr('target','_blank')

            $editor.parent().append($description)


            var $edit = $('<a class="clsButton clsSmall clsBlue" href="#" style="display:inline-block;padding-left: 4px; padding-right: 4px;">Edit Description</a>')

            var $full = $('<a class="clsButton clsSmall clsBlue toggle-fullscreen-description" href="#" style="display:inline-block;padding-left: 4px; padding-right: 4px;">Fullscreen</a>')

            var $pop = $('<a class="clsButton clsSmall clsBlue" href="#" style="display:inline-block;padding-left: 4px; padding-right: 4px;">Pop Out</a>')

            $editor.parent().prepend($pop).prepend('&nbsp;').prepend($full).prepend('&nbsp;').prepend($edit)

            $edit.one('click', function (e) {
                $description.remove()
                $editor.show()
                $edit.remove()
                $full.remove()

                e.preventDefault()
            })

            $full.on('click', function (e) {
                $('html').toggleClass('fullscreen-description')
                e.preventDefault()
            })

            $pop.on('click', function (e) {
                var title = $('#ctl00_plcContentPlaceHolder_txtName').val()
                var clientName = $('#ctl00_plcContentPlaceHolder_lnkDomainName').text()
                var clientURL = $('#ctl00_plcContentPlaceHolder_lnkDomainName').attr('href')
                console.log('title', title)
                var w = window.open(window.location.origin, title, 'width=600,height=600,resizeable,scrollbars')
                w.document.write('<html>')
                w.document.write('  <head>')
                w.document.write('    <title>' + title + '</title>')
                w.document.write('    <style>body{font-family:arial;font-size:16px;}a{color:#60AB45;}a.autolinked{color:inherit;text-decoration:inherit;background:rgba(96, 171, 69, 0.0980392);}</style>')
                w.document.write('  </head>')
                w.document.write('  <body>')
                w.document.write('    <p>')
                w.document.write('      <strong><a onclick="window.close()" href="' + window.location + '" target="_blank">' + title + '</a></strong>')
                w.document.write('      - <a onclick="window.close()" href="' + clientURL + '" target="_blank">' + clientName + '</a>')
                w.document.write('    </p>')
                w.document.write('    <hr>')
                w.document.write('    <div>' + description + '</div>')
                w.document.write('  </body>')
                w.document.write('</html>')
                w.document.close()
            })


            var showNotes = $('#ctl00_plcContentPlaceHolder_lnkTaskNotes')[0], clickEvent = new MouseEvent('click')

            showNotes.dispatchEvent(clickEvent)


            $('#divTaskNotes table tr:nth-child(2) td:nth-child(2)').each(function(i, td) {
                // console.log(td)
                td.innerHTML = '<pre>' + td.innerHTML.slice(40, -37) + '</pre>'

            })



            aspnetForm && formObsrever.observe(aspnetForm, {childList: true})

        }


        if(location.href.match('apps.caorda.com/dashboard/tasks/tasklist.aspx')) {
            var taskList = $('#ctl00_plcContentPlaceHolder_ctl00_plcContentPlaceHolder_pnlSelectAssignedPanel,#ctl00_plcContentPlaceHolder_ctl00_plcContentPlaceHolder_grdSelectPanel')[0]
            var timeEntries = $('#ctl00_plcContentPlaceHolder_ctl00_plcContentPlaceHolder_pnlSelectDailyPanel')[0]
            var aspnetForm = document.getElementById("aspnetForm")

            var taskListObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if(mutation.addedNodes) {
                        if(mutation.addedNodes[0]) {
                            if(mutation.addedNodes[0].id === "ctl00_plcContentPlaceHolder_pnlSelectAssigned") {
                                onTaskListLoaded()
                            }
                        }
                    }
                })
            })

            var timeEntriesObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if(mutation.addedNodes) {
                        if(mutation.addedNodes[0]) {
                            if(mutation.addedNodes[0].id === "ctl00_plcContentPlaceHolder_pnlSelectDaily") {
                                onTimeEntriesLoaded(currentTask)
                            }
                        }
                    }
                })
            })


            var $td, $clock, $hours, $minutes, start = new Date()

            var assignedTasks = [], currentTask

            function onTaskListLoaded () {
                loadAssignedTasks()
                loadSupportTasks()
            }

            function onTimeEntriesLoaded () {
                loadTimeEntries()
                injectClock()
            }

            function onAssignTaskModalLoaded (e) {
                var $selectUser = $(e.target).contents().find('#selAssigneeUserID'),
                user = _.find(contacts, function (contact) {
                    return contact.shortName == currentTask.owner
                })

                $selectUser.find('option:contains("' + user.firstName + ' ' + user.lastName + '")').prop('selected',true)

                $(e.target).contents().find('#txtComment').val('Task complete.').focus().select()

            }

            function loadTimeEntries() {

            }

            function injectClock() {
                // console.log('inject clock')
                var i, totalHours = 0, totalMinutes = 0

                ;(function (m){
                    if(m) {
                        totalMinutes = parseInt(m[2], 10) || 0
                        totalHours =  parseInt(m[1], 10) || 0
                    }
                }(/^(?:([0-9]+)h\s)?(?:([0-9]+)m)$/.exec($('#ctl00_plcContentPlaceHolder_lblTotalTime').text())))

                localStorage.setItem('loggedHours', totalHours)
                localStorage.setItem('loggedMinutes', totalMinutes)

                if (JSON.parse(localStorage.getItem('startHours')) === null) {
                    localStorage.setItem('startHours', 8)
                }

                if (JSON.parse(localStorage.getItem('startMinutes')) === null) {
                    localStorage.setItem('startMinutes', 0)
                }

                $div = $('<div>')
                $clock = $('<span id="total-time">')
                $hours = $('<select>')
                $minutes = $('<select>')

                for(i = 7; i <= 18; i++ ) {
                    $hours.append($('<option value="' + i + '">' + (function(i) {
                        if(i > 12) {
                            return (i - 12)
                        } else {
                            return i
                        }
                    })(i) + '</option>'))
                }
                $hours.find('option[value="' + JSON.parse(localStorage.getItem('startHours')) + '"]').attr('selected',true)

                $minutes.append($('<option value="0">00</option>'))
                $minutes.append($('<option value="5">05</option>'))
                for(i = 5; i <= 55; i+=5 ) {
                    $minutes.append($('<option value="' + i + '">' + i + '</option>'))
                }
                $minutes.find('option[value="' + JSON.parse(localStorage.getItem('startMinutes')) + '"]').attr('selected',true)


                $div.css({'font-weight':'bold', 'position':'absolute', 'padding-bottom':'3px', 'bottom':'0px','right':'7px','line-height':'20px'})
                
                $div.append($clock)
                $div.append('<span>&nbsp;</span>')
                $div.append($hours)
                $div.append('<span>:</span>')
                $div.append($minutes)

                $clock.siblings().hide()

                $div.on('mouseenter',function () {
                    $clock.siblings().show()
                    $clock.hide()

                    $div.css({'padding-bottom':'203px','bottom':'-200px'})
                })

                $div.on('mouseleave',function () {
                    $clock.siblings().hide()
                    $clock.show()
                    $div.css({'padding-bottom':'3px','bottom':'0px'})
                })

                $hours.on('change', setStartTime)
                $minutes.on('change', setStartTime)

                $('#ctl00_plcContentPlaceHolder_pnlSelectDaily').css({'position':'relative','min-height':'100px'}).append($div)

                start = new Date()


                setStartTime()

                function setStartTime() {
                    localStorage.setItem("startHours",$hours[0].value)
                    localStorage.setItem("startMinutes",$minutes[0].value)
                    start.setHours($hours[0].value)
                    start.setMinutes($minutes[0].value)
                    start.setSeconds(0)
                    updateClock()
                }

                function updateClock() {
                    var diff = Date.now() - start

                    var seconds = parseInt(diff / 1000, 10)

                    var hours = parseInt(seconds / 3600, 10)
                    seconds = seconds % 3600

                    var minutes = parseInt(seconds / 60, 10)
                    seconds = seconds % 60

                    localStorage.setItem("workedHours",hours)
                    localStorage.setItem("workedMinutes",minutes)

                    $clock.html('Worked: ' + (hours > 0 ? hours + 'h&nbsp;' : '') + (minutes > 0 ? minutes + 'm' : '0m'))
                }

                setInterval(updateClock, 200)
            }

            function loadAssignedTasks() {
                console.log('loadAssignedTasks')
                assignedTasks = getTasksFromTable($('#ctl00_plcContentPlaceHolder_grdSelectAssigned'))

                renderTaskTable("Assigned Tasks", assignedTasks, true)
            }

            function renderTaskTable(title, tasks, showPriorityColumn) {

                var $taskTable = $($.render.tasktable({'title':title,'tasks':tasks, 'showPriorityColumn': showPriorityColumn}))

                $taskTable.find('tr[data-href]').on('click', function (e) {
                    var taskID = $(this).data('task-id')

                    currentTask = _.find(assignedTasks, function (task) {
                        return task.id === taskID
                    })

                    if( $(e.target).closest('a[href]').length ) {
                        return
                    }
                    // console.log($(this).data('href'))
                    document.location.href = $(this).data('href')
                    e.preventDefault()
                })

                $taskTable.find('[data-actions]').hover(
                    function (e) {
                        $(this).parent().addClass('show-actions')
                    },
                    function (e) {
                        $(this).parent().removeClass('show-actions')
                    }
                )

                $taskTable.find('tr[data-task-id]').each(function () {
                    var $this = $(this),
                    taskId = $this.data('task-id')

                    getTaskMeta('visited',taskId,function (data) {
                        var visited = !!data
                        // console.log(visited)

                        if(!visited) {
                            $this.addClass('status-unread')
                        }
                    })
                })


                var notesInputs = $taskTable.find('input.notes')
                
                notesInputs
                .on('click', function (e) {
                    e.stopPropagation()
                })
                .on('blur', function (e) {
                    setTaskMeta('note',$(this).data('task-id'),this.value)
                })
                .each(function (i,e) {
                    var $this = $(this)

                    $this.attr('tabindex',i)

                    getTaskMeta('note',$this.data('task-id'),function (note) {
                        $this.attr('value',note)
                    })
                })


                $(document).on('keydown', function (e) {
                    if(e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 38 || e.keyCode == 40 && notesInputs.find(e.target)) {
                        var $target = $(e.target),
                        direction = e.shiftKey ? 'prev' : 'next'

                        if(e.keyCode == 38 || e.shiftKey) {
                            direction = 'prev'
                        } else {
                            direction = 'next'
                        }

                        $target.closest('tr')[direction]().find('input.notes').focus().select()

                        e.preventDefault()
                        e.stopPropagation()
                    }
                })
                $('#ctl00_plcContentPlaceHolder_pnlSelectAssigned').before($taskTable)
            }

            function loadSupportTasks() {
                    // console.log('loadSupportTasks')
                    $.get('//apps.caorda.com/dashboard/tasks/tasks.aspx?Action=LoadAssignee&AssigneeUserID=11626&TaskStatusID=2')
                    .done(function (data) {
                        var tasks = getTasksFromTable($(data).find('#ctl00_plcContentPlaceHolder_grdSelect'))
                        var savedTasks
                        renderTaskTable('Support Tasks', tasks, false)
                    })
            }

            function getTasksFromTable($table) {
                var tasks = [], $head = $table.find('tr.clsHeader')

                columns = {
                    priority: $head.find('th:contains("#")').index(),
                    created: $head.find('th:contains("Created")').index(),
                    due: $head.find('th:contains("Due")').index(),
                    client: $head.find('th:contains("Client")').index(),
                    title: $head.find('th:contains("Title")').index(),
                    assignee: $head.find('th:contains("Assignee")').index(),
                    owner: $head.find('th:contains("Owner")').index(),
                    details: -1,
                    queue: $head.find('th:contains("Queue")').index(),
                    urgency: $head.find('th:contains("Urgency")').index(),
                    status: $head.find('th:contains("Status")').index(),
                    edit: -1,
                    actions: $head.find('th:last-child').index()
                }

                if( columns.owner != -1 ) {
                    // the details column is immediately to the right of the owner column
                    columns.details = columns.owner + 1
                }

                if( columns.status != -1 ) {
                    // the edit column is immediately to the right of the status column
                    columns.edit = columns.status + 1
                }

                $table.find('tr.clsRow, tr.clsRowLast').each(function () {
                    var actions = [], contact, emailLink

                    var $this= $(this), td = $this.children('td'),
                    detailsTd = $(td[columns.details]).find('.clsTaskDetails td')

                    var task = {
                        id: (function (onclick){
                            var start = onclick.indexOf('(') + 1, end = onclick.indexOf(',')
                            return parseInt(onclick.substring(start, end),10)
                        })($(td[columns.actions]).find('li[id$="_liCreateTaskTime"] a').attr('onclick')),
                        priority: $.trim($(td[columns.priority]).text()),
                        created: $.trim($(td[columns.created]).text()),
                        due: $.trim($(td[columns.due]).text()),
                        title: $.trim($(td[columns.title]).text()),
                        assignee: $.trim($(td[columns.assignee]).text()),
                        owner: $.trim($(td[columns.owner]).text()),
                        urgency: $(td[columns.urgency]).find('img').attr('title'),
                        status: $(td[columns.status]).find('img').attr('title'),
                        clientId: (function (href) {
                            return parseInt(href.substring(href.indexOf('ID=') + 3),10)
                        })($(td[columns.client]).find('a').attr('href')),
                        clientName: $.trim($(td[columns.client]).find('a').text()),
                        queue: $.trim($(detailsTd[1]).text()),
                        projectName: $.trim($(detailsTd[3]).text()),
                        estimatedTime: $.trim($(detailsTd[5]).text()),
                        billableTime: $.trim($(detailsTd[7]).text()),
                        nonBillableTime: $.trim($(detailsTd[9]).text()),
                        totalTime: $.trim($(detailsTd[11]).text()),
                        onBudget: $(detailsTd[13]).text().indexOf('On Budget') >= 0
                    }

                    $this.find('.clsNestedListMenu.clsTask li ul a').each(function (index) {
                        var $this = $(this),
                        text = $this.text(),
                        action = {
                            text: text,
                            href: this.href,
                            onclick: $this.attr('onclick')
                        }

                        if(text.indexOf('C') === 0) {
                            // Change Status to Complete
                            action.icon = 'fa-check-square-o'
                        }
                        if(text.indexOf('As') === 0) {
                            // Assign Task
                            action.icon = 'fa-share'
                        }
                        if(text.indexOf('Vi') === 0) {
                            // View Time Entires
                            action.icon  ='fa-bar-chart'
                        }
                        if(text.indexOf('Ad') === 0) {
                            // Add Time Entry
                            action.icon = 'fa-clock-o'
                        }
                        actions.splice(0,0,action)
                    })

                    if(actions.length === 3) {
                        actions.splice(1,0,{
                                href: '#',
                                className: 'disabled',
                                onclick: 'return false',
                                text: 'View Time Entires',
                                icon: 'fa-bar-chart'
                        })
                    }


                    contact = _.find(contacts, function (contact) {
                        return contact.shortName === task.owner
                    })
                    emailLink = 'mailto:' + contact.email + '?subject=' + encodeURIComponent(task.clientName + ' - ' + task.title) + '&body=' + encodeURIComponent('\nhttps://apps.caorda.com/dashboard/tasks/tasks.aspx?Action=LoadTask&TaskID=' + task.id)

                    task.statusClass = 'status-' + task.status.replace(/\W+/,'-').toLowerCase()
                    task.urgencyClass = 'urgency-' + task.urgency.replace(/\W+/,'-').toLowerCase()
                    task.queueClass = 'queue-' + task.queue.replace(/\W+/,'-').toLowerCase()
                    task.emailLink = emailLink
                    task.actions = actions

                    tasks.push(task)
                })
                return tasks
            }

            loadAssignedTasks()
            loadSupportTasks()
            loadTimeEntries()
            injectClock()

            taskList && taskListObserver.observe(taskList, {childList: true})
            timeEntries && timeEntriesObserver.observe(timeEntries, {childList: true})
            aspnetForm && formObsrever.observe(aspnetForm, {childList: true})
        }

    })
}



/*!
 * Autolinker.js
 * 0.12.4
 *
 * Copyright(c) 2014 Gregory Jacobs <greg@greg-jacobs.com>
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 *
 * https://github.com/gregjacobs/Autolinker.js
 */
/*global define, module */
var AutoLinker = function() {

    /**
     * @class Autolinker
     * @extends Object
     * 
     * Utility class used to process a given string of text, and wrap the URLs, email addresses, and Twitter handles in 
     * the appropriate anchor (&lt;a&gt;) tags to turn them into links.
     * 
     * Any of the configuration options may be provided in an Object (map) provided to the Autolinker constructor, which
     * will configure how the {@link #link link()} method will process the links.
     * 
     * For example:
     * 
     *     var autolinker = new Autolinker( {
     *         newWindow : false,
     *         truncate  : 30
     *     } );
     *     
     *     var html = autolinker.link( "Joe went to www.yahoo.com" );
     *     // produces: 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>'
     * 
     * 
     * The {@link #static-link static link()} method may also be used to inline options into a single call, which may
     * be more convenient for one-off uses. For example:
     * 
     *     var html = Autolinker.link( "Joe went to www.yahoo.com", {
     *         newWindow : false,
     *         truncate  : 30
     *     } );
     *     // produces: 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>'
     * 
     * 
     * ## Custom Replacements of Links
     * 
     * If the configuration options do not provide enough flexibility, a {@link #replaceFn} may be provided to fully customize
     * the output of Autolinker. This function is called once for each URL/Email/Twitter handle match that is encountered.
     * 
     * For example:
     * 
     *     var input = "...";  // string with URLs, Email Addresses, and Twitter Handles
     *     
     *     var linkedText = Autolinker.link( input, {
     *         replaceFn : function( autolinker, match ) {
     *             console.log( "href = ", match.getAnchorHref() );
     *             console.log( "text = ", match.getAnchorText() );
     *         
     *             switch( match.getType() ) {
     *                 case 'url' : 
     *                     console.log( "url: ", match.getUrl() );
     *                     
     *                     if( match.getUrl().indexOf( 'mysite.com' ) === -1 ) {
     *                         var tag = autolinker.getTagBuilder().build( match );  // returns an `Autolinker.HtmlTag` instance, which provides mutator methods for easy changes
     *                         tag.setAttr( 'rel', 'nofollow' );
     *                         tag.addClass( 'external-link' );
     *                         
     *                         return tag;
     *                         
     *                     } else {
     *                         return true;  // let Autolinker perform its normal anchor tag replacement
     *                     }
     *                     
     *                 case 'email' :
     *                     var email = match.getEmail();
     *                     console.log( "email: ", email );
     *                     
     *                     if( email === "my@own.address" ) {
     *                         return false;  // don't auto-link this particular email address; leave as-is
     *                     } else {
     *                         return;  // no return value will have Autolinker perform its normal anchor tag replacement (same as returning `true`)
     *                     }
     *                 
     *                 case 'twitter' :
     *                     var twitterHandle = match.getTwitterHandle();
     *                     console.log( twitterHandle );
     *                     
     *                     return '<a href="http://newplace.to.link.twitter.handles.to/">' + twitterHandle + '</a>';
     *             }
     *         }
     *     } );
     * 
     * 
     * The function may return the following values:
     * 
     * - `true` (Boolean): Allow Autolinker to replace the match as it normally would.
     * - `false` (Boolean): Do not replace the current match at all - leave as-is.
     * - Any String: If a string is returned from the function, the string will be used directly as the replacement HTML for
     *   the match.
     * - An {@link Autolinker.HtmlTag} instance, which can be used to build/modify an HTML tag before writing out its HTML text.
     * 
     * @constructor
     * @param {Object} [config] The configuration options for the Autolinker instance, specified in an Object (map).
     */
    var Autolinker = function( cfg ) {
        Autolinker.Util.assign( this, cfg );  // assign the properties of `cfg` onto the Autolinker instance. Prototype properties will be used for missing configs.
    };
    
    
    Autolinker.prototype = {
        constructor : Autolinker,  // fix constructor property
        
        /**
         * @cfg {Boolean} urls
         * 
         * `true` if miscellaneous URLs should be automatically linked, `false` if they should not be.
         */
        urls : true,
        
        /**
         * @cfg {Boolean} email
         * 
         * `true` if email addresses should be automatically linked, `false` if they should not be.
         */
        email : true,
        
        /**
         * @cfg {Boolean} twitter
         * 
         * `true` if Twitter handles ("@example") should be automatically linked, `false` if they should not be.
         */
        twitter : true,
        
        /**
         * @cfg {Boolean} newWindow
         * 
         * `true` if the links should open in a new window, `false` otherwise.
         */
        newWindow : true,
        
        /**
         * @cfg {Boolean} stripPrefix
         * 
         * `true` if 'http://' or 'https://' and/or the 'www.' should be stripped from the beginning of URL links' text, 
         * `false` otherwise.
         */
        stripPrefix : true,
        
        /**
         * @cfg {Number} truncate
         * 
         * A number for how many characters long URLs/emails/twitter handles should be truncated to inside the text of 
         * a link. If the URL/email/twitter is over this number of characters, it will be truncated to this length by 
         * adding a two period ellipsis ('..') to the end of the string.
         * 
         * For example: A url like 'http://www.yahoo.com/some/long/path/to/a/file' truncated to 25 characters might look
         * something like this: 'yahoo.com/some/long/pat..'
         */
        
        /**
         * @cfg {String} className
         * 
         * A CSS class name to add to the generated links. This class will be added to all links, as well as this class
         * plus url/email/twitter suffixes for styling url/email/twitter links differently.
         * 
         * For example, if this config is provided as "myLink", then:
         * 
         * - URL links will have the CSS classes: "myLink myLink-url"
         * - Email links will have the CSS classes: "myLink myLink-email", and
         * - Twitter links will have the CSS classes: "myLink myLink-twitter"
         */
        className : "",
            
        /**
         * @cfg {Function} replaceFn
         * 
         * A function to individually process each URL/Email/Twitter match found in the input string.
         * 
         * See the class's description for usage.
         * 
         * This function is called with the following parameters:
         * 
         * @cfg {Autolinker} replaceFn.autolinker The Autolinker instance, which may be used to retrieve child objects from (such
         *   as the instance's {@link #getTagBuilder tag builder}).
         * @cfg {Autolinker.match.Match} replaceFn.match The Match instance which can be used to retrieve information about the
         *   {@link Autolinker.match.Url URL}/{@link Autolinker.match.Email email}/{@link Autolinker.match.Twitter Twitter}
         *   match that the `replaceFn` is currently processing.
         */
        
        
        /**
         * @private
         * @property {RegExp} htmlCharacterEntitiesRegex
         *
         * The regular expression that matches common HTML character entities.
         * 
         * Ignoring &amp; as it could be part of a query string -- handling it separately.
         */
        htmlCharacterEntitiesRegex: /(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;)/gi,
        
        /**
         * @private
         * @property {RegExp} matcherRegex
         * 
         * The regular expression that matches URLs, email addresses, and Twitter handles.
         * 
         * This regular expression has the following capturing groups:
         * 
         * 1. Group that is used to determine if there is a Twitter handle match (i.e. \@someTwitterUser). Simply check for its 
         *    existence to determine if there is a Twitter handle match. The next couple of capturing groups give information 
         *    about the Twitter handle match.
         * 2. The whitespace character before the \@sign in a Twitter handle. This is needed because there are no lookbehinds in
         *    JS regular expressions, and can be used to reconstruct the original string in a replace().
         * 3. The Twitter handle itself in a Twitter match. If the match is '@someTwitterUser', the handle is 'someTwitterUser'.
         * 4. Group that matches an email address. Used to determine if the match is an email address, as well as holding the full 
         *    address. Ex: 'me@my.com'
         * 5. Group that matches a URL in the input text. Ex: 'http://google.com', 'www.google.com', or just 'google.com'.
         *    This also includes a path, url parameters, or hash anchors. Ex: google.com/path/to/file?q1=1&q2=2#myAnchor
         * 6. A protocol-relative ('//') match for the case of a 'www.' prefixed URL. Will be an empty string if it is not a 
         *    protocol-relative match. We need to know the character before the '//' in order to determine if it is a valid match
         *    or the // was in a string we don't want to auto-link.
         * 7. A protocol-relative ('//') match for the case of a known TLD prefixed URL. Will be an empty string if it is not a 
         *    protocol-relative match. See #6 for more info. 
         */
        matcherRegex : (function() {
            var twitterRegex = /(^|[^\w])@(\w{1,15})/,              // For matching a twitter handle. Ex: @gregory_jacobs
                
                emailRegex = /(?:[\-;:&=\+\$,\w\.]+@)/,             // something@ for email addresses (a.k.a. local-part)
                
                protocolRegex = /(?:[A-Za-z]{3,9}:(?:\/\/)?)/,      // match protocol, allow in format http:// or mailto:
                wwwRegex = /(?:www\.)/,                             // starting with 'www.'
                domainNameRegex = /[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/,  // anything looking at all like a domain, non-unicode domains, not ending in a period
                tldRegex = /\.(?:international|construction|contractors|enterprises|photography|productions|foundation|immobilien|industries|management|properties|technology|christmas|community|directory|education|equipment|institute|marketing|solutions|vacations|bargains|boutique|builders|catering|cleaning|clothing|computer|democrat|diamonds|graphics|holdings|lighting|partners|plumbing|supplies|training|ventures|academy|careers|company|cruises|domains|exposed|flights|florist|gallery|guitars|holiday|kitchen|neustar|okinawa|recipes|rentals|reviews|shiksha|singles|support|systems|agency|berlin|camera|center|coffee|condos|dating|estate|events|expert|futbol|kaufen|luxury|maison|monash|museum|nagoya|photos|repair|report|social|supply|tattoo|tienda|travel|viajes|villas|vision|voting|voyage|actor|build|cards|cheap|codes|dance|email|glass|house|mango|ninja|parts|photo|shoes|solar|today|tokyo|tools|watch|works|aero|arpa|asia|best|bike|blue|buzz|camp|club|cool|coop|farm|fish|gift|guru|info|jobs|kiwi|kred|land|limo|link|menu|mobi|moda|name|pics|pink|post|qpon|rich|ruhr|sexy|tips|vote|voto|wang|wien|wiki|zone|bar|bid|biz|cab|cat|ceo|com|edu|gov|int|kim|mil|net|onl|org|pro|pub|red|tel|uno|wed|xxx|xyz|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)\b/,   // match our known top level domains (TLDs)
                
                // Allow optional path, query string, and hash anchor, not ending in the following characters: "!:,.;"
                // http://blog.codinghorror.com/the-problem-with-urls/
                urlSuffixRegex = /(?:[\-A-Za-z0-9+&@#\/%?=~_()|!:,.;\$\*]*[\-A-Za-z0-9+&@#\/%=~_()|\$\*])?/;  // note: optional part of the full regex
            
            return new RegExp( [
                '(',  // *** Capturing group $1, which can be used to check for a twitter handle match. Use group $3 for the actual twitter handle though. $2 may be used to reconstruct the original string in a replace() 
                    // *** Capturing group $2, which matches the whitespace character before the '@' sign (needed because of no lookbehinds), and 
                    // *** Capturing group $3, which matches the actual twitter handle
                    twitterRegex.source,
                ')',
                
                '|',
                
                '(',  // *** Capturing group $4, which is used to determine an email match
                    emailRegex.source,
                    domainNameRegex.source,
                    tldRegex.source,
                ')',
                
                '|',
                
                '(',  // *** Capturing group $5, which is used to match a URL
                    '(?:', // parens to cover match for protocol (optional), and domain
                        '(?:',  // non-capturing paren for a protocol-prefixed url (ex: http://google.com)
                            protocolRegex.source,
                            domainNameRegex.source,
                        ')',
                        
                        '|',
                        
                        '(?:',  // non-capturing paren for a 'www.' prefixed url (ex: www.google.com)
                            '(.?//)?',  // *** Capturing group $6 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
                            wwwRegex.source,
                            domainNameRegex.source,
                        ')',
                        
                        '|',
                        
                        '(?:',  // non-capturing paren for known a TLD url (ex: google.com)
                            '(.?//)?',  // *** Capturing group $7 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
                            domainNameRegex.source,
                            tldRegex.source,
                        ')',
                    ')',
                    
                    urlSuffixRegex.source,  // match for path, query string, and/or hash anchor
                ')'
            ].join( "" ), 'gi' );
        } )(),
        
        /**
         * @private
         * @property {RegExp} invalidProtocolRelMatchRegex
         * 
         * The regular expression used to check a potential protocol-relative URL match, coming from the {@link #matcherRegex}. 
         * A protocol-relative URL is, for example, "//yahoo.com"
         * 
         * This regular expression is used in conjunction with the {@link #matcherRegex}, and checks to see if there is a word character
         * before the '//' in order to determine if we should actually autolink a protocol-relative URL. This is needed because there
         * is no negative look-behind in JavaScript regular expressions. 
         * 
         * For instance, we want to autolink something like "//google.com", but we don't want to autolink something 
         * like "abc//google.com"
         */
        invalidProtocolRelMatchRegex : /^[\w]\/\//,
        
        /**
         * @private
         * @property {RegExp} charBeforeProtocolRelMatchRegex
         * 
         * The regular expression used to retrieve the character before a protocol-relative URL match.
         * 
         * This is used in conjunction with the {@link #matcherRegex}, which needs to grab the character before a protocol-relative
         * '//' due to the lack of a negative look-behind in JavaScript regular expressions. The character before the match is stripped
         * from the URL.
         */
        charBeforeProtocolRelMatchRegex : /^(.)?\/\//,
        
        /**
         * @private
         * @property {Autolinker.HtmlParser} htmlParser
         * 
         * The HtmlParser instance used to skip over HTML tags, while finding text nodes to process. This is lazily instantiated
         * in the {@link #getHtmlParser} method.
         */
        
        /**
         * @private
         * @property {Autolinker.AnchorTagBuilder} tagBuilder
         * 
         * The AnchorTagBuilder instance used to build the URL/email/Twitter replacement anchor tags. This is lazily instantiated
         * in the {@link #getTagBuilder} method.
         */
        
        
        /**
         * Automatically links URLs, email addresses, and Twitter handles found in the given chunk of HTML. 
         * Does not link URLs found within HTML tags.
         * 
         * For instance, if given the text: `You should go to http://www.yahoo.com`, then the result
         * will be `You should go to &lt;a href="http://www.yahoo.com"&gt;http://www.yahoo.com&lt;/a&gt;`
         * 
         * This method finds the text around any HTML elements in the input `textOrHtml`, which will be the text that is processed.
         * Any original HTML elements will be left as-is, as well as the text that is already wrapped in anchor (&lt;a&gt;) tags.
         * 
         * @param {String} textOrHtml The HTML or text to link URLs, email addresses, and Twitter handles within (depending on if
         *   the {@link #urls}, {@link #email}, and {@link #twitter} options are enabled).
         * @return {String} The HTML, with URLs/emails/Twitter handles automatically linked.
         */
        link : function( textOrHtml ) {
            var me = this,  // for closure
                htmlParser = this.getHtmlParser(),
                htmlCharacterEntitiesRegex = this.htmlCharacterEntitiesRegex,
                anchorTagStackCount = 0,  // used to only process text around anchor tags, and any inner text/html they may have
                resultHtml = [];
            
            htmlParser.parse( textOrHtml, {
                // Process HTML nodes in the input `textOrHtml`
                processHtmlNode : function( tagText, tagName, isClosingTag ) {
                    if( tagName === 'a' ) {
                        if( !isClosingTag ) {  // it's the start <a> tag
                            anchorTagStackCount++;
                        } else {   // it's the end </a> tag
                            anchorTagStackCount = Math.max( anchorTagStackCount - 1, 0 );  // attempt to handle extraneous </a> tags by making sure the stack count never goes below 0
                        }
                    }
                    resultHtml.push( tagText );  // now add the text of the tag itself verbatim
                },
                
                // Process text nodes in the input `textOrHtml`
                processTextNode : function( text ) {
                    if( anchorTagStackCount === 0 ) {
                        // If we're not within an <a> tag, process the text node
                        var unescapedText = Autolinker.Util.splitAndCapture( text, htmlCharacterEntitiesRegex );  // split at HTML entities, but include the HTML entities in the results array
                        
                        for ( var i = 0, len = unescapedText.length; i < len; i++ ) {
                            var textToProcess = unescapedText[ i ],
                                processedTextNode = me.processTextNode( textToProcess );
                            
                            resultHtml.push( processedTextNode );
                        }
                        
                    } else {
                        // `text` is within an <a> tag, simply append the text - we do not want to autolink anything 
                        // already within an <a>...</a> tag
                        resultHtml.push( text );
                    }
                }
            } );
            
            return resultHtml.join( "" );
        },
        
        
        /**
         * Lazily instantiates and returns the {@link #htmlParser} instance for this Autolinker instance.
         * 
         * @protected
         * @return {Autolinker.HtmlParser}
         */
        getHtmlParser : function() {
            var htmlParser = this.htmlParser;
            
            if( !htmlParser ) {
                htmlParser = this.htmlParser = new Autolinker.HtmlParser();
            }
            
            return htmlParser;
        },
        
        
        /**
         * Returns the {@link #tagBuilder} instance for this Autolinker instance, lazily instantiating it
         * if it does not yet exist.
         * 
         * This method may be used in a {@link #replaceFn} to generate the {@link Autolinker.HtmlTag HtmlTag} instance that 
         * Autolinker would normally generate, and then allow for modifications before returning it. For example:
         * 
         *     var html = Autolinker.link( "Test google.com", {
         *         replaceFn : function( autolinker, match ) {
         *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance
         *             tag.setAttr( 'rel', 'nofollow' );
         *             
         *             return tag;
         *         }
         *     } );
         *     
         *     // generated html:
         *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
         * 
         * @return {Autolinker.AnchorTagBuilder}
         */
        getTagBuilder : function() {
            var tagBuilder = this.tagBuilder;
            
            if( !tagBuilder ) {
                tagBuilder = this.tagBuilder = new Autolinker.AnchorTagBuilder( {
                    newWindow   : this.newWindow,
                    truncate    : this.truncate,
                    className   : this.className
                } );
            }
            
            return tagBuilder;
        },
        
        
        /**
         * Process the text that lies inbetween HTML tags. This method does the actual wrapping of URLs with
         * anchor tags.
         * 
         * @private
         * @param {String} text The text to auto-link.
         * @return {String} The text with anchor tags auto-filled.
         */
        processTextNode : function( text ) {
            var me = this;  // for closure
            
            return text.replace( this.matcherRegex, function( matchStr, $1, $2, $3, $4, $5, $6, $7 ) {
                var matchDescObj = me.processCandidateMatch.apply( me, arguments );  // match description object
                
                // Return out with no changes for match types that are disabled (url, email, twitter), or for matches that are 
                // invalid (false positives from the matcherRegex, which can't use look-behinds since they are unavailable in JS).
                if( !matchDescObj ) {
                    return matchStr;
                    
                } else {
                    // Generate the replacement text for the match
                    var matchReturnVal = me.createMatchReturnVal( matchDescObj.match, matchDescObj.matchStr );
                    return matchDescObj.prefixStr + matchReturnVal + matchDescObj.suffixStr;
                }
            } );
        },
        
        
        /**
         * Processes a candidate match from the {@link #matcherRegex}. 
         * 
         * Not all matches found by the regex are actual URL/email/Twitter matches, as determined by {@link #isValidMatch}. In
         * this case, the method returns `null`. Otherwise, a valid Object with `prefixStr`, `match`, and `suffixStr` is returned.
         * 
         * @private
         * @param {String} matchStr The full match that was found by the {@link #matcherRegex}.
         * @param {String} twitterMatch The matched text of a Twitter handle, if the match is a Twitter match.
         * @param {String} twitterHandlePrefixWhitespaceChar The whitespace char before the @ sign in a Twitter handle match. This 
         *   is needed because of no lookbehinds in JS regexes, and is need to re-include the character for the anchor tag replacement.
         * @param {String} twitterHandle The actual Twitter user (i.e the word after the @ sign in a Twitter match).
         * @param {String} emailAddressMatch The matched email address for an email address match.
         * @param {String} urlMatch The matched URL string for a URL match.
         * @param {String} wwwProtocolRelativeMatch The '//' for a protocol-relative match from a 'www' url, with the character that 
         *   comes before the '//'.
         * @param {String} tldProtocolRelativeMatch The '//' for a protocol-relative match from a TLD (top level domain) match, with 
         *   the character that comes before the '//'.
         *   
         * @return {Object} A "match description object". This will be `null` if the match was invalid, or if a match type is disabled.
         *   Otherwise, this will be an Object (map) with the following properties:
         * @return {String} return.prefixStr The char(s) that should be prepended to the replacement string. These are char(s) that
         *   were needed to be included from the regex match that were ignored by processing code, and should be re-inserted into 
         *   the replacement stream.
         * @return {String} return.suffixStr The char(s) that should be appended to the replacement string. These are char(s) that
         *   were needed to be included from the regex match that were ignored by processing code, and should be re-inserted into 
         *   the replacement stream.
         * @return {String} return.matchStr The `matchStr`, fixed up to remove characters that are no longer needed (which have been
         *   added to `prefixStr` and `suffixStr`).
         * @return {Autolinker.match.Match} return.match The Match object that represents the match that was found.
         */
        processCandidateMatch : function( 
            matchStr, twitterMatch, twitterHandlePrefixWhitespaceChar, twitterHandle, 
            emailAddressMatch, urlMatch, wwwProtocolRelativeMatch, tldProtocolRelativeMatch
        ) {
            var protocolRelativeMatch = wwwProtocolRelativeMatch || tldProtocolRelativeMatch,
                match,  // Will be an Autolinker.match.Match object
                
                prefixStr = "",       // A string to use to prefix the anchor tag that is created. This is needed for the Twitter handle match
                suffixStr = "";       // A string to suffix the anchor tag that is created. This is used if there is a trailing parenthesis that should not be auto-linked.
                
            
            // Return out with `null` for match types that are disabled (url, email, twitter), or for matches that are 
            // invalid (false positives from the matcherRegex, which can't use look-behinds since they are unavailable in JS).
            if( !this.isValidMatch( twitterMatch, emailAddressMatch, urlMatch, protocolRelativeMatch ) ) {
                return null;
            }
            
            // Handle a closing parenthesis at the end of the match, and exclude it if there is not a matching open parenthesis
            // in the match itself. 
            if( this.matchHasUnbalancedClosingParen( matchStr ) ) {
                matchStr = matchStr.substr( 0, matchStr.length - 1 );  // remove the trailing ")"
                suffixStr = ")";  // this will be added after the generated <a> tag
            }
            
            
            if( emailAddressMatch ) {
                match = new Autolinker.match.Email( { matchedText: matchStr, email: emailAddressMatch } );
                
            } else if( twitterMatch ) {
                // fix up the `matchStr` if there was a preceding whitespace char, which was needed to determine the match 
                // itself (since there are no look-behinds in JS regexes)
                if( twitterHandlePrefixWhitespaceChar ) {
                    prefixStr = twitterHandlePrefixWhitespaceChar;
                    matchStr = matchStr.slice( 1 );  // remove the prefixed whitespace char from the match
                }
                match = new Autolinker.match.Twitter( { matchedText: matchStr, twitterHandle: twitterHandle } );
                
            } else {  // url match
                // If it's a protocol-relative '//' match, remove the character before the '//' (which the matcherRegex needed
                // to match due to the lack of a negative look-behind in JavaScript regular expressions)
                if( protocolRelativeMatch ) {
                    var charBeforeMatch = protocolRelativeMatch.match( this.charBeforeProtocolRelMatchRegex )[ 1 ] || "";
                    
                    if( charBeforeMatch ) {  // fix up the `matchStr` if there was a preceding char before a protocol-relative match, which was needed to determine the match itself (since there are no look-behinds in JS regexes)
                        prefixStr = charBeforeMatch;
                        matchStr = matchStr.slice( 1 );  // remove the prefixed char from the match
                    }
                }
                
                match = new Autolinker.match.Url( {
                    matchedText : matchStr,
                    url : matchStr,
                    protocolRelativeMatch : protocolRelativeMatch,
                    stripPrefix : this.stripPrefix
                } );
            }
            
            return {
                prefixStr : prefixStr,
                suffixStr : suffixStr,
                matchStr  : matchStr,
                match     : match
            };
        },
        
        
        
        
        /**
         * Determines if a given match found by {@link #processTextNode} is valid. Will return `false` for:
         * 
         * 1) Disabled link types (i.e. having a Twitter match, but {@link #twitter} matching is disabled)
         * 2) URL matches which do not have at least have one period ('.') in the domain name (effectively skipping over 
         *    matches like "abc:def")
         * 3) A protocol-relative url match (a URL beginning with '//') whose previous character is a word character 
         *    (effectively skipping over strings like "abc//google.com")
         * 
         * Otherwise, returns `true`.
         * 
         * @private
         * @param {String} twitterMatch The matched Twitter handle, if there was one. Will be empty string if the match is not a 
         *   Twitter match.
         * @param {String} emailAddressMatch The matched Email address, if there was one. Will be empty string if the match is not 
         *   an Email address match.
         * @param {String} urlMatch The matched URL, if there was one. Will be an empty string if the match is not a URL match.
         * @param {String} protocolRelativeMatch The protocol-relative string for a URL match (i.e. '//'), possibly with a preceding
         *   character (ex, a space, such as: ' //', or a letter, such as: 'a//'). The match is invalid if there is a word character
         *   preceding the '//'.
         * @return {Boolean} `true` if the match given is valid and should be processed, or `false` if the match is invalid and/or 
         *   should just not be processed (such as, if it's a Twitter match, but {@link #twitter} matching is disabled}.
         */
        isValidMatch : function( twitterMatch, emailAddressMatch, urlMatch, protocolRelativeMatch ) {
            if( 
                ( twitterMatch && !this.twitter ) || ( emailAddressMatch && !this.email ) || ( urlMatch && !this.urls ) ||
                ( urlMatch && urlMatch.indexOf( '.' ) === -1 ) ||  // At least one period ('.') must exist in the URL match for us to consider it an actual URL
                ( urlMatch && /^[A-Za-z]{3,9}:/.test( urlMatch ) && !/:.*?[A-Za-z]/.test( urlMatch ) ) ||     // At least one letter character must exist in the domain name after a protocol match. Ex: skip over something like "git:1.0"
                ( protocolRelativeMatch && this.invalidProtocolRelMatchRegex.test( protocolRelativeMatch ) )  // a protocol-relative match which has a word character in front of it (so we can skip something like "abc//google.com")
            ) {
                return false;
            }
            
            return true;
        },
        
        
        /**
         * Determines if a match found has an unmatched closing parenthesis. If so, this parenthesis will be removed
         * from the match itself, and appended after the generated anchor tag in {@link #processTextNode}.
         * 
         * A match may have an extra closing parenthesis at the end of the match because the regular expression must include parenthesis
         * for URLs such as "wikipedia.com/something_(disambiguation)", which should be auto-linked. 
         * 
         * However, an extra parenthesis *will* be included when the URL itself is wrapped in parenthesis, such as in the case of
         * "(wikipedia.com/something_(disambiguation))". In this case, the last closing parenthesis should *not* be part of the URL 
         * itself, and this method will return `true`.
         * 
         * @private
         * @param {String} matchStr The full match string from the {@link #matcherRegex}.
         * @return {Boolean} `true` if there is an unbalanced closing parenthesis at the end of the `matchStr`, `false` otherwise.
         */
        matchHasUnbalancedClosingParen : function( matchStr ) {
            var lastChar = matchStr.charAt( matchStr.length - 1 );
            
            if( lastChar === ')' ) {
                var openParensMatch = matchStr.match( /\(/g ),
                    closeParensMatch = matchStr.match( /\)/g ),
                    numOpenParens = ( openParensMatch && openParensMatch.length ) || 0,
                    numCloseParens = ( closeParensMatch && closeParensMatch.length ) || 0;
                
                if( numOpenParens < numCloseParens ) {
                    return true;
                }
            }
            
            return false;
        },
        
        
        /**
         * Creates the return string value for a given match in the input string, for the {@link #processTextNode} method.
         * 
         * This method handles the {@link #replaceFn}, if one was provided.
         * 
         * @private
         * @param {Autolinker.match.Match} match The Match object that represents the match.
         * @param {String} matchStr The original match string, after having been preprocessed to fix match edge cases (see
         *   the `prefixStr` and `suffixStr` vars in {@link #processTextNode}.
         * @return {String} The string that the `match` should be replaced with. This is usually the anchor tag string, but
         *   may be the `matchStr` itself if the match is not to be replaced.
         */
        createMatchReturnVal : function( match, matchStr ) {
            // Handle a custom `replaceFn` being provided
            var replaceFnResult;
            if( this.replaceFn ) {
                replaceFnResult = this.replaceFn.call( this, this, match );  // Autolinker instance is the context, and the first arg
            }
            
            if( typeof replaceFnResult === 'string' ) {
                return replaceFnResult;  // `replaceFn` returned a string, use that
                
            } else if( replaceFnResult === false ) {
                return matchStr;  // no replacement for the match
                
            } else if( replaceFnResult instanceof Autolinker.HtmlTag ) {
                return replaceFnResult.toString();
            
            } else {  // replaceFnResult === true, or no/unknown return value from function
                // Perform Autolinker's default anchor tag generation
                var tagBuilder = this.getTagBuilder(),
                    anchorTag = tagBuilder.build( match );  // returns an Autolinker.HtmlTag instance
                
                return anchorTag.toString();
            }
        }
    
    };
    
    
    /**
     * Automatically links URLs, email addresses, and Twitter handles found in the given chunk of HTML. 
     * Does not link URLs found within HTML tags.
     * 
     * For instance, if given the text: `You should go to http://www.yahoo.com`, then the result
     * will be `You should go to &lt;a href="http://www.yahoo.com"&gt;http://www.yahoo.com&lt;/a&gt;`
     * 
     * Example:
     * 
     *     var linkedText = Autolinker.link( "Go to google.com", { newWindow: false } );
     *     // Produces: "Go to <a href="http://google.com">google.com</a>"
     * 
     * @static
     * @param {String} textOrHtml The HTML or text to find URLs, email addresses, and Twitter handles within (depending on if
     *   the {@link #urls}, {@link #email}, and {@link #twitter} options are enabled).
     * @param {Object} [options] Any of the configuration options for the Autolinker class, specified in an Object (map).
     *   See the class description for an example call.
     * @return {String} The HTML text, with URLs automatically linked
     */
    Autolinker.link = function( textOrHtml, options ) {
        var autolinker = new Autolinker( options );
        return autolinker.link( textOrHtml );
    };
    
    
    // Namespace for `match` classes
    Autolinker.match = {};
    /*global Autolinker */
    /*jshint eqnull:true, boss:true */
    /**
     * @class Autolinker.Util
     * @singleton
     * 
     * A few utility methods for Autolinker.
     */
    Autolinker.Util = {
        
        /**
         * @property {Function} abstractMethod
         * 
         * A function object which represents an abstract method.
         */
        abstractMethod : function() { throw "abstract"; },
        
        
        /**
         * Assigns (shallow copies) the properties of `src` onto `dest`.
         * 
         * @param {Object} dest The destination object.
         * @param {Object} src The source object.
         * @return {Object} The destination object (`dest`)
         */
        assign : function( dest, src ) {
            for( var prop in src ) {
                if( src.hasOwnProperty( prop ) ) {
                    dest[ prop ] = src[ prop ];
                }
            }
            
            return dest;
        },
        
        
        /**
         * Extends `superclass` to create a new subclass, adding the `protoProps` to the new subclass's prototype.
         * 
         * @param {Function} superclass The constructor function for the superclass.
         * @param {Object} protoProps The methods/properties to add to the subclass's prototype. This may contain the
         *   special property `constructor`, which will be used as the new subclass's constructor function.
         * @return {Function} The new subclass function.
         */
        extend : function( superclass, protoProps ) {
            var superclassProto = superclass.prototype;
            
            var F = function() {};
            F.prototype = superclassProto;
            
            var subclass;
            if( protoProps.hasOwnProperty( 'constructor' ) ) {
                subclass = protoProps.constructor;
            } else {
                subclass = function() { superclassProto.constructor.apply( this, arguments ); };
            }
            
            var subclassProto = subclass.prototype = new F();  // set up prototype chain
            subclassProto.constructor = subclass;  // fix constructor property
            subclassProto.superclass = superclassProto;
            
            delete protoProps.constructor;  // don't re-assign constructor property to the prototype, since a new function may have been created (`subclass`), which is now already there
            Autolinker.Util.assign( subclassProto, protoProps );
            
            return subclass;
        },
        
        
        /**
         * Truncates the `str` at `len - ellipsisChars.length`, and adds the `ellipsisChars` to the
         * end of the string (by default, two periods: '..'). If the `str` length does not exceed 
         * `len`, the string will be returned unchanged.
         * 
         * @param {String} str The string to truncate and add an ellipsis to.
         * @param {Number} truncateLen The length to truncate the string at.
         * @param {String} [ellipsisChars=..] The ellipsis character(s) to add to the end of `str`
         *   when truncated. Defaults to '..'
         */
        ellipsis : function( str, truncateLen, ellipsisChars ) {
            if( str.length > truncateLen ) {
                ellipsisChars = ( ellipsisChars == null ) ? '..' : ellipsisChars;
                str = str.substring( 0, truncateLen - ellipsisChars.length ) + ellipsisChars;
            }
            return str;
        },
        
        
        /**
         * Supports `Array.prototype.indexOf()` functionality for old IE (IE8 and below).
         * 
         * @param {Array} arr The array to find an element of.
         * @param {*} element The element to find in the array, and return the index of.
         * @return {Number} The index of the `element`, or -1 if it was not found.
         */
        indexOf : function( arr, element ) {
            if( Array.prototype.indexOf ) {
                return arr.indexOf( element );
                
            } else {
                for( var i = 0, len = arr.length; i < len; i++ ) {
                    if( arr[ i ] === element ) return i;
                }
                return -1;
            }
        },
        
        
        
        /**
         * Performs the functionality of what modern browsers do when `String.prototype.split()` is called
         * with a regular expression that contains capturing parenthesis.
         * 
         * For example:
         * 
         *     // Modern browsers: 
         *     "a,b,c".split( /(,)/ );  // --> [ 'a', ',', 'b', ',', 'c' ]
         *     
         *     // Old IE (including IE8):
         *     "a,b,c".split( /(,)/ );  // --> [ 'a', 'b', 'c' ]
         *     
         * This method emulates the functionality of modern browsers for the old IE case.
         * 
         * @param {String} str The string to split.
         * @param {RegExp} splitRegex The regular expression to split the input `str` on. The splitting
         *   character(s) will be spliced into the array, as in the "modern browsers" example in the 
         *   description of this method. 
         *   Note #1: the supplied regular expression **must** have the 'g' flag specified.
         *   Note #2: for simplicity's sake, the regular expression does not need 
         *   to contain capturing parenthesis - it will be assumed that any match has them.
         * @return {String[]} The split array of strings, with the splitting character(s) included.
         */
        splitAndCapture : function( str, splitRegex ) {
            if( !splitRegex.global ) throw new Error( "`splitRegex` must have the 'g' flag set" );
            
            var result = [],
                lastIdx = 0,
                match;
            
            while( match = splitRegex.exec( str ) ) {
                result.push( str.substring( lastIdx, match.index ) );
                result.push( match[ 0 ] );  // push the splitting char(s)
                
                lastIdx = match.index + match[ 0 ].length;
            }
            result.push( str.substring( lastIdx ) );
            
            return result;
        }
        
    };
    /*global Autolinker */
    /**
     * @private
     * @class Autolinker.HtmlParser
     * @extends Object
     * 
     * An HTML parser implementation which simply walks an HTML string and calls the provided visitor functions to process 
     * HTML and text nodes.
     * 
     * Autolinker uses this to only link URLs/emails/Twitter handles within text nodes, basically ignoring HTML tags.
     */
    Autolinker.HtmlParser = Autolinker.Util.extend( Object, {
        
        /**
         * @private
         * @property {RegExp} htmlRegex
         * 
         * The regular expression used to pull out HTML tags from a string. Handles namespaced HTML tags and
         * attribute names, as specified by http://www.w3.org/TR/html-markup/syntax.html.
         * 
         * Capturing groups:
         * 
         * 1. If it is an end tag, this group will have the '/'.
         * 2. The tag name.
         */
        htmlRegex : (function() {
            var tagNameRegex = /[0-9a-zA-Z:]+/,
                attrNameRegex = /[^\s\0"'>\/=\x01-\x1F\x7F]+/,   // the unicode range accounts for excluding control chars, and the delete char
                attrValueRegex = /(?:".*?"|'.*?'|[^'"=<>`\s]+)/, // double quoted, single quoted, or unquoted attribute values
                nameEqualsValueRegex = attrNameRegex.source + '(?:\\s*=\\s*' + attrValueRegex.source + ')?';  // optional '=[value]'
            
            return new RegExp( [
                '<(?:!|(/))?',  // Beginning of a tag. Either '<' for a start tag, '</' for an end tag, or <! for the <!DOCTYPE ...> tag. The slash or an empty string is Capturing Group 1.
                
                    // The tag name (Capturing Group 2)
                    '(' + tagNameRegex.source + ')',
                    
                    // Zero or more attributes following the tag name
                    '(?:',
                        '\\s+',  // one or more whitespace chars before an attribute
                        
                        // Either:
                        // A. tag="value", or 
                        // B. "value" alone (for <!DOCTYPE> tag. Ex: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">) 
                        '(?:', nameEqualsValueRegex, '|', attrValueRegex.source + ')',
                    ')*',
                    
                    '\\s*/?',  // any trailing spaces and optional '/' before the closing '>'
                '>'
            ].join( "" ), 'g' );
        } )(),
        
        
        /**
         * Walks an HTML string, calling the `options.processHtmlNode` function for each HTML tag that is encountered, and calling
         * the `options.processTextNode` function when each text around HTML tags is encountered.
         * 
         * @param {String} html The HTML to parse.
         * @param {Object} [options] An Object (map) which may contain the following properties:
         * 
         * @param {Function} [options.processHtmlNode] A visitor function which allows processing of an encountered HTML node.
         *   This function is called with the following arguments:
         * @param {String} [options.processHtmlNode.tagText] The HTML tag text that was found.
         * @param {String} [options.processHtmlNode.tagName] The tag name for the HTML tag that was found. Ex: 'a' for an anchor tag.
         * @param {String} [options.processHtmlNode.isClosingTag] `true` if the tag is a closing tag (ex: &lt;/a&gt;), `false` otherwise.
         *  
         * @param {Function} [options.processTextNode] A visitor function which allows processing of an encountered text node.
         *   This function is called with the following arguments:
         * @param {String} [options.processTextNode.text] The text node that was matched.
         */
        parse : function( html, options ) {
            options = options || {};
            
            var processHtmlNodeVisitor = options.processHtmlNode || function() {},
                processTextNodeVisitor = options.processTextNode || function() {},
                htmlRegex = this.htmlRegex,
                currentResult,
                lastIndex = 0;
            
            // Loop over the HTML string, ignoring HTML tags, and processing the text that lies between them,
            // wrapping the URLs in anchor tags
            while( ( currentResult = htmlRegex.exec( html ) ) !== null ) {
                var tagText = currentResult[ 0 ],
                    tagName = currentResult[ 2 ],
                    isClosingTag = !!currentResult[ 1 ],
                    inBetweenTagsText = html.substring( lastIndex, currentResult.index );
                
                if( inBetweenTagsText ) {
                    processTextNodeVisitor( inBetweenTagsText );
                }
                
                processHtmlNodeVisitor( tagText, tagName, isClosingTag );
                
                lastIndex = currentResult.index + tagText.length;
            }
            
            // Process any remaining text after the last HTML element. Will process all of the text if there were no HTML elements.
            if( lastIndex < html.length ) {
                var text = html.substring( lastIndex );
                
                if( text ) {
                    processTextNodeVisitor( text );
                }
            }
        }
        
    } );
    /*global Autolinker */
    /*jshint boss:true */
    /**
     * @class Autolinker.HtmlTag
     * @extends Object
     * 
     * Represents an HTML tag, which can be used to easily build/modify HTML tags programmatically.
     * 
     * Autolinker uses this abstraction to create HTML tags, and then write them out as strings. You may also use
     * this class in your code, especially within a {@link Autolinker#replaceFn replaceFn}.
     * 
     * ## Examples
     * 
     * Example instantiation:
     * 
     *     var tag = new Autolinker.HtmlTag( {
     *         tagName : 'a',
     *         attrs   : { 'href': 'http://google.com', 'class': 'external-link' },
     *         innerHtml : 'Google'
     *     } );
     *     
     *     tag.toString();  // <a href="http://google.com" class="external-link">Google</a>
     *     
     *     // Individual accessor methods
     *     tag.getTagName();                 // 'a'
     *     tag.getAttr( 'href' );            // 'http://google.com'
     *     tag.hasClass( 'external-link' );  // true
     * 
     * 
     * Using mutator methods (which may be used in combination with instantiation config properties):
     * 
     *     var tag = new Autolinker.HtmlTag();
     *     tag.setTagName( 'a' );
     *     tag.setAttr( 'href', 'http://google.com' );
     *     tag.addClass( 'external-link' );
     *     tag.setInnerHtml( 'Google' );
     *     
     *     tag.getTagName();                 // 'a'
     *     tag.getAttr( 'href' );            // 'http://google.com'
     *     tag.hasClass( 'external-link' );  // true
     *     
     *     tag.toString();  // <a href="http://google.com" class="external-link">Google</a>
     *     
     * 
     * ## Example use within a {@link Autolinker#replaceFn replaceFn}
     * 
     *     var html = Autolinker.link( "Test google.com", {
     *         replaceFn : function( autolinker, match ) {
     *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance, configured with the Match's href and anchor text
     *             tag.setAttr( 'rel', 'nofollow' );
     *             
     *             return tag;
     *         }
     *     } );
     *     
     *     // generated html:
     *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
     *     
     *     
     * ## Example use with a new tag for the replacement
     * 
     *     var html = Autolinker.link( "Test google.com", {
     *         replaceFn : function( autolinker, match ) {
     *             var tag = new Autolinker.HtmlTag( {
     *                 tagName : 'button',
     *                 attrs   : { 'title': 'Load URL: ' + match.getAnchorHref() },
     *                 innerHtml : 'Load URL: ' + match.getAnchorText()
     *             } );
     *             
     *             return tag;
     *         }
     *     } );
     *     
     *     // generated html:
     *     //   Test <button title="Load URL: http://google.com">Load URL: google.com</button>
     */
    Autolinker.HtmlTag = Autolinker.Util.extend( Object, {
        
        /**
         * @cfg {String} tagName
         * 
         * The tag name. Ex: 'a', 'button', etc.
         * 
         * Not required at instantiation time, but should be set using {@link #setTagName} before {@link #toString}
         * is executed.
         */
        
        /**
         * @cfg {Object.<String, String>} attrs
         * 
         * An key/value Object (map) of attributes to create the tag with. The keys are the attribute names, and the
         * values are the attribute values.
         */
        
        /**
         * @cfg {String} innerHtml
         * 
         * The inner HTML for the tag. 
         * 
         * Note the camel case name on `innerHtml`. Acronyms are camelCased in this utility (such as not to run into the acronym 
         * naming inconsistency that the DOM developers created with `XMLHttpRequest`). You may alternatively use {@link #innerHTML}
         * if you prefer, but this one is recommended.
         */
        
        /**
         * @cfg {String} innerHTML
         * 
         * Alias of {@link #innerHtml}, accepted for consistency with the browser DOM api, but prefer the camelCased version
         * for acronym names.
         */
        
        
        /**
         * @protected
         * @property {RegExp} whitespaceRegex
         * 
         * Regular expression used to match whitespace in a string of CSS classes.
         */
        whitespaceRegex : /\s+/,
        
        
        /**
         * @constructor
         * @param {Object} [cfg] The configuration properties for this class, in an Object (map)
         */
        constructor : function( cfg ) {
            Autolinker.Util.assign( this, cfg );
            
            this.innerHtml = this.innerHtml || this.innerHTML;  // accept either the camelCased form or the fully capitalized acronym
        },
        
        
        /**
         * Sets the tag name that will be used to generate the tag with.
         * 
         * @param {String} tagName
         * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
         */
        setTagName : function( tagName ) {
            this.tagName = tagName;
            return this;
        },
        
        
        /**
         * Retrieves the tag name.
         * 
         * @return {String}
         */
        getTagName : function() {
            return this.tagName || "";
        },
        
        
        /**
         * Sets an attribute on the HtmlTag.
         * 
         * @param {String} attrName The attribute name to set.
         * @param {String} attrValue The attribute value to set.
         * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
         */
        setAttr : function( attrName, attrValue ) {
            var tagAttrs = this.getAttrs();
            tagAttrs[ attrName ] = attrValue;
            
            return this;
        },
        
        
        /**
         * Retrieves an attribute from the HtmlTag. If the attribute does not exist, returns `undefined`.
         * 
         * @param {String} name The attribute name to retrieve.
         * @return {String} The attribute's value, or `undefined` if it does not exist on the HtmlTag.
         */
        getAttr : function( attrName ) {
            return this.getAttrs()[ attrName ];
        },
        
        
        /**
         * Sets one or more attributes on the HtmlTag.
         * 
         * @param {Object.<String, String>} attrs A key/value Object (map) of the attributes to set.
         * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
         */
        setAttrs : function( attrs ) {
            var tagAttrs = this.getAttrs();
            Autolinker.Util.assign( tagAttrs, attrs );
            
            return this;
        },
        
        
        /**
         * Retrieves the attributes Object (map) for the HtmlTag.
         * 
         * @return {Object.<String, String>} A key/value object of the attributes for the HtmlTag.
         */
        getAttrs : function() {
            return this.attrs || ( this.attrs = {} );
        },
        
        
        /**
         * Sets the provided `cssClass`, overwriting any current CSS classes on the HtmlTag.
         * 
         * @param {String} cssClass One or more space-separated CSS classes to set (overwrite).
         * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
         */
        setClass : function( cssClass ) {
            return this.setAttr( 'class', cssClass );
        },
        
        
        /**
         * Convenience method to add one or more CSS classes to the HtmlTag. Will not add duplicate CSS classes.
         * 
         * @param {String} cssClass One or more space-separated CSS classes to add.
         * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
         */
        addClass : function( cssClass ) {
            var classAttr = this.getClass(),
                whitespaceRegex = this.whitespaceRegex,
                indexOf = Autolinker.Util.indexOf,  // to support IE8 and below
                classes = ( !classAttr ) ? [] : classAttr.split( whitespaceRegex ),
                newClasses = cssClass.split( whitespaceRegex ),
                newClass;
            
            while( newClass = newClasses.shift() ) {
                if( indexOf( classes, newClass ) === -1 ) {
                    classes.push( newClass );
                }
            }
            
            this.getAttrs()[ 'class' ] = classes.join( " " );
            return this;
        },
        
        
        /**
         * Convenience method to remove one or more CSS classes from the HtmlTag.
         * 
         * @param {String} cssClass One or more space-separated CSS classes to remove.
         * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
         */
        removeClass : function( cssClass ) {
            var classAttr = this.getClass(),
                whitespaceRegex = this.whitespaceRegex,
                indexOf = Autolinker.Util.indexOf,  // to support IE8 and below
                classes = ( !classAttr ) ? [] : classAttr.split( whitespaceRegex ),
                removeClasses = cssClass.split( whitespaceRegex ),
                removeClass;
            
            while( classes.length && ( removeClass = removeClasses.shift() ) ) {
                var idx = indexOf( classes, removeClass );
                if( idx !== -1 ) {
                    classes.splice( idx, 1 );
                }
            }
            
            this.getAttrs()[ 'class' ] = classes.join( " " );
            return this;
        },
        
        
        /**
         * Convenience method to retrieve the CSS class(es) for the HtmlTag, which will each be separated by spaces when
         * there are multiple.
         * 
         * @return {String}
         */
        getClass : function() {
            return this.getAttrs()[ 'class' ] || "";
        },
        
        
        /**
         * Convenience method to check if the tag has a CSS class or not.
         * 
         * @param {String} cssClass The CSS class to check for.
         * @return {Boolean} `true` if the HtmlTag has the CSS class, `false` otherwise.
         */
        hasClass : function( cssClass ) {
            return ( ' ' + this.getClass() + ' ' ).indexOf( ' ' + cssClass + ' ' ) !== -1;
        },
        
        
        /**
         * Sets the inner HTML for the tag.
         * 
         * @param {String} html The inner HTML to set.
         * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
         */
        setInnerHtml : function( html ) {
            this.innerHtml = html;
            
            return this;
        },
        
        
        /**
         * Retrieves the inner HTML for the tag.
         * 
         * @return {String}
         */
        getInnerHtml : function() {
            return this.innerHtml || "";
        },
        
        
        /**
         * Override of superclass method used to generate the HTML string for the tag.
         * 
         * @return {String}
         */
        toString : function() {
            var tagName = this.getTagName(),
                attrsStr = this.buildAttrsStr();
            
            attrsStr = ( attrsStr ) ? ' ' + attrsStr : '';  // prepend a space if there are actually attributes
            
            return [ '<', tagName, attrsStr, '>', this.getInnerHtml(), '</', tagName, '>' ].join( "" );
        },
        
        
        /**
         * Support method for {@link #toString}, returns the string space-separated key="value" pairs, used to populate 
         * the stringified HtmlTag.
         * 
         * @protected
         * @return {String} Example return: `attr1="value1" attr2="value2"`
         */
        buildAttrsStr : function() {
            if( !this.attrs ) return "";  // no `attrs` Object (map) has been set, return empty string
            
            var attrs = this.getAttrs(),
                attrsArr = [];
            
            for( var prop in attrs ) {
                if( attrs.hasOwnProperty( prop ) ) {
                    attrsArr.push( prop + '="' + attrs[ prop ] + '"' );
                }
            }
            return attrsArr.join( " " );
        }
        
    } );
    /*global Autolinker */
    /*jshint sub:true */
    /**
     * @protected
     * @class Autolinker.AnchorTagBuilder
     * @extends Object
     * 
     * Builds anchor (&lt;a&gt;) tags for the Autolinker utility when a match is found.
     * 
     * Normally this class is instantiated, configured, and used internally by an {@link Autolinker} instance, but may 
     * actually be retrieved in a {@link Autolinker#replaceFn replaceFn} to create {@link Autolinker.HtmlTag HtmlTag} instances
     * which may be modified before returning from the {@link Autolinker#replaceFn replaceFn}. For example:
     * 
     *     var html = Autolinker.link( "Test google.com", {
     *         replaceFn : function( autolinker, match ) {
     *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance
     *             tag.setAttr( 'rel', 'nofollow' );
     *             
     *             return tag;
     *         }
     *     } );
     *     
     *     // generated html:
     *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
     */
    Autolinker.AnchorTagBuilder = Autolinker.Util.extend( Object, {
        
        /**
         * @cfg {Boolean} newWindow
         * @inheritdoc Autolinker#newWindow
         */
        
        /**
         * @cfg {Number} truncate
         * @inheritdoc Autolinker#truncate
         */
        
        /**
         * @cfg {String} className
         * @inheritdoc Autolinker#className
         */
        
        
        /**
         * @constructor
         * @param {Object} [cfg] The configuration options for the AnchorTagBuilder instance, specified in an Object (map).
         */
        constructor : function( cfg ) {
            Autolinker.Util.assign( this, cfg );
        },
        
        
        /**
         * Generates the actual anchor (&lt;a&gt;) tag to use in place of the matched URL/email/Twitter text,
         * via its `match` object.
         * 
         * @param {Autolinker.match.Match} match The Match instance to generate an anchor tag from.
         * @return {Autolinker.HtmlTag} The HtmlTag instance for the anchor tag.
         */
        build : function( match ) {
            var tag = new Autolinker.HtmlTag( {
                tagName   : 'a',
                attrs     : this.createAttrs( match.getType(), match.getAnchorHref() ),
                innerHtml : this.processAnchorText( match.getAnchorText() )
            } );
            
            return tag;
        },
        
        
        /**
         * Creates the Object (map) of the HTML attributes for the anchor (&lt;a&gt;) tag being generated.
         * 
         * @protected
         * @param {"url"/"email"/"twitter"} matchType The type of match that an anchor tag is being generated for.
         * @param {String} href The href for the anchor tag.
         * @return {Object} A key/value Object (map) of the anchor tag's attributes. 
         */
        createAttrs : function( matchType, anchorHref ) {
            var attrs = {
                'href' : anchorHref  // we'll always have the `href` attribute
            };
            
            var cssClass = this.createCssClass( matchType );
            if( cssClass ) {
                attrs[ 'class' ] = cssClass;
            }
            if( this.newWindow ) {
                attrs[ 'target' ] = "_blank";
            }
            
            return attrs;
        },
        
        
        /**
         * Creates the CSS class that will be used for a given anchor tag, based on the `matchType` and the {@link #className}
         * config.
         * 
         * @private
         * @param {"url"/"email"/"twitter"} matchType The type of match that an anchor tag is being generated for.
         * @return {String} The CSS class string for the link. Example return: "myLink myLink-url". If no {@link #className}
         *   was configured, returns an empty string.
         */
        createCssClass : function( matchType ) {
            var className = this.className;
            
            if( !className ) 
                return "";
            else
                return className + " " + className + "-" + matchType;  // ex: "myLink myLink-url", "myLink myLink-email", or "myLink myLink-twitter"
        },
        
        
        /**
         * Processes the `anchorText` by truncating the text according to the {@link #truncate} config.
         * 
         * @private
         * @param {String} anchorText The anchor tag's text (i.e. what will be displayed).
         * @return {String} The processed `anchorText`.
         */
        processAnchorText : function( anchorText ) {
            anchorText = this.doTruncate( anchorText );
            
            return anchorText;
        },
        
        
        /**
         * Performs the truncation of the `anchorText`, if the `anchorText` is longer than the {@link #truncate} option.
         * Truncates the text to 2 characters fewer than the {@link #truncate} option, and adds ".." to the end.
         * 
         * @private
         * @param {String} text The anchor tag's text (i.e. what will be displayed).
         * @return {String} The truncated anchor text.
         */
        doTruncate : function( anchorText ) {
            return Autolinker.Util.ellipsis( anchorText, this.truncate || Number.POSITIVE_INFINITY );
        }
        
    } );
    /*global Autolinker */
    /**
     * @abstract
     * @class Autolinker.match.Match
     * 
     * Represents a match found in an input string which should be Autolinked. A Match object is what is provided in a 
     * {@link Autolinker#replaceFn replaceFn}, and may be used to query for details about the match.
     * 
     * For example:
     * 
     *     var input = "...";  // string with URLs, Email Addresses, and Twitter Handles
     *     
     *     var linkedText = Autolinker.link( input, {
     *         replaceFn : function( autolinker, match ) {
     *             console.log( "href = ", match.getAnchorHref() );
     *             console.log( "text = ", match.getAnchorText() );
     *         
     *             switch( match.getType() ) {
     *                 case 'url' : 
     *                     console.log( "url: ", match.getUrl() );
     *                     
     *                 case 'email' :
     *                     console.log( "email: ", match.getEmail() );
     *                     
     *                 case 'twitter' :
     *                     console.log( "twitter: ", match.getTwitterHandle() );
     *             }
     *         }
     *     } );
     *     
     * See the {@link Autolinker} class for more details on using the {@link Autolinker#replaceFn replaceFn}.
     */
    Autolinker.match.Match = Autolinker.Util.extend( Object, {
        
        /**
         * @cfg {String} matchedText (required)
         * 
         * The original text that was matched.
         */
        
        
        /**
         * @constructor
         * @param {Object} cfg The configuration properties for the Match instance, specified in an Object (map).
         */
        constructor : function( cfg ) {
            Autolinker.Util.assign( this, cfg );
        },
    
        
        /**
         * Returns a string name for the type of match that this class represents.
         * 
         * @abstract
         * @return {String}
         */
        getType : Autolinker.Util.abstractMethod,
        
        
        /**
         * Returns the original text that was matched.
         * 
         * @return {String}
         */
        getMatchedText : function() {
            return this.matchedText;
        },
        
    
        /**
         * Returns the anchor href that should be generated for the match.
         * 
         * @abstract
         * @return {String}
         */
        getAnchorHref : Autolinker.Util.abstractMethod,
        
        
        /**
         * Returns the anchor text that should be generated for the match.
         * 
         * @abstract
         * @return {String}
         */
        getAnchorText : Autolinker.Util.abstractMethod
    
    } );
    /*global Autolinker */
    /**
     * @class Autolinker.match.Email
     * @extends Autolinker.match.Match
     * 
     * Represents a Email match found in an input string which should be Autolinked.
     * 
     * See this class's superclass ({@link Autolinker.match.Match}) for more details.
     */
    Autolinker.match.Email = Autolinker.Util.extend( Autolinker.match.Match, {
        
        /**
         * @cfg {String} email (required)
         * 
         * The email address that was matched.
         */
        
    
        /**
         * Returns a string name for the type of match that this class represents.
         * 
         * @return {String}
         */
        getType : function() {
            return 'email';
        },
        
        
        /**
         * Returns the email address that was matched.
         * 
         * @return {String}
         */
        getEmail : function() {
            return this.email;
        },
        
    
        /**
         * Returns the anchor href that should be generated for the match.
         * 
         * @return {String}
         */
        getAnchorHref : function() {
            return 'mailto:' + this.email;
        },
        
        
        /**
         * Returns the anchor text that should be generated for the match.
         * 
         * @return {String}
         */
        getAnchorText : function() {
            return this.email;
        }
        
    } );
    /*global Autolinker */
    /**
     * @class Autolinker.match.Twitter
     * @extends Autolinker.match.Match
     * 
     * Represents a Twitter match found in an input string which should be Autolinked.
     * 
     * See this class's superclass ({@link Autolinker.match.Match}) for more details.
     */
    Autolinker.match.Twitter = Autolinker.Util.extend( Autolinker.match.Match, {
        
        /**
         * @cfg {String} twitterHandle (required)
         * 
         * The Twitter handle that was matched.
         */
        
    
        /**
         * Returns the type of match that this class represents.
         * 
         * @return {String}
         */
        getType : function() {
            return 'twitter';
        },
        
        
        /**
         * Returns a string name for the type of match that this class represents.
         * 
         * @return {String}
         */
        getTwitterHandle : function() {
            return this.twitterHandle;
        },
        
    
        /**
         * Returns the anchor href that should be generated for the match.
         * 
         * @return {String}
         */
        getAnchorHref : function() {
            return 'https://twitter.com/' + this.twitterHandle;
        },
        
        
        /**
         * Returns the anchor text that should be generated for the match.
         * 
         * @return {String}
         */
        getAnchorText : function() {
            return '@' + this.twitterHandle;
        }
        
    } );
    /*global Autolinker */
    /**
     * @class Autolinker.match.Url
     * @extends Autolinker.match.Match
     * 
     * Represents a Url match found in an input string which should be Autolinked.
     * 
     * See this class's superclass ({@link Autolinker.match.Match}) for more details.
     */
    Autolinker.match.Url = Autolinker.Util.extend( Autolinker.match.Match, {
        
        /**
         * @cfg {String} url (required)
         * 
         * The url that was matched.
         */
        
        /**
         * @cfg {Boolean} protocolRelativeMatch (required)
         * 
         * `true` if the URL is a protocol-relative match. A protocol-relative match is a URL that starts with '//',
         * and will be either http:// or https:// based on the protocol that the site is loaded under.
         */
        
        /**
         * @cfg {Boolean} stripPrefix (required)
         * @inheritdoc Autolinker#stripPrefix
         */
        
    
        /**
         * @private
         * @property {RegExp} urlPrefixRegex
         * 
         * A regular expression used to remove the 'http://' or 'https://' and/or the 'www.' from URLs.
         */
        urlPrefixRegex: /^(https?:\/\/)?(www\.)?/i,
        
        /**
         * @private
         * @property {RegExp} protocolRelativeRegex
         * 
         * The regular expression used to remove the protocol-relative '//' from the {@link #url} string, for purposes
         * of {@link #getAnchorText}. A protocol-relative URL is, for example, "//yahoo.com"
         */
        protocolRelativeRegex : /^\/\//,
        
        /**
         * @protected
         * @property {RegExp} checkForProtocolRegex
         * 
         * A regular expression used to check if the {@link #url} is missing a protocol (in which case, 'http://'
         * will be added).
         */
        checkForProtocolRegex: /^[A-Za-z]{3,9}:/,
        
    
        /**
         * Returns a string name for the type of match that this class represents.
         * 
         * @return {String}
         */
        getType : function() {
            return 'url';
        },
        
        
        /**
         * Returns the url that was matched, assuming the protocol to be 'http://' if the match
         * was missing a protocol.
         * 
         * @return {String}
         */
        getUrl : function() {
            var url = this.url;
            
            // if the url string doesn't begin with a protocol, assume http://
            if( !this.protocolRelativeMatch && !this.checkForProtocolRegex.test( url ) ) {
                url = this.url = 'http://' + url;
            }
            
            return url;
        },
        
    
        /**
         * Returns the anchor href that should be generated for the match.
         * 
         * @return {String}
         */
        getAnchorHref : function() {
            var url = this.getUrl();
            
            return url.replace( /&amp;/g, '&' );  // any &amp;'s in the URL should be converted back to '&' if they were displayed as &amp; in the source html 
        },
        
        
        /**
         * Returns the anchor text that should be generated for the match.
         * 
         * @return {String}
         */
        getAnchorText : function() {
            var anchorText = this.getUrl();
            
            if( this.protocolRelativeMatch ) {
                // Strip off any protocol-relative '//' from the anchor text
                anchorText = this.stripProtocolRelativePrefix( anchorText );
            }
            if( this.stripPrefix ) {
                anchorText = this.stripUrlPrefix( anchorText );
            }
            anchorText = this.removeTrailingSlash( anchorText );  // remove trailing slash, if there is one
            
            return anchorText;
        },
        
        
        // ---------------------------------------
        
        // Utility Functionality
        
        /**
         * Strips the URL prefix (such as "http://" or "https://") from the given text.
         * 
         * @private
         * @param {String} text The text of the anchor that is being generated, for which to strip off the
         *   url prefix (such as stripping off "http://")
         * @return {String} The `anchorText`, with the prefix stripped.
         */
        stripUrlPrefix : function( text ) {
            return text.replace( this.urlPrefixRegex, '' );
        },
        
        
        /**
         * Strips any protocol-relative '//' from the anchor text.
         * 
         * @private
         * @param {String} text The text of the anchor that is being generated, for which to strip off the
         *   protocol-relative prefix (such as stripping off "//")
         * @return {String} The `anchorText`, with the protocol-relative prefix stripped.
         */
        stripProtocolRelativePrefix : function( text ) {
            return text.replace( this.protocolRelativeRegex, '' );
        },
        
        
        /**
         * Removes any trailing slash from the given `anchorText`, in preparation for the text to be displayed.
         * 
         * @private
         * @param {String} anchorText The text of the anchor that is being generated, for which to remove any trailing
         *   slash ('/') that may exist.
         * @return {String} The `anchorText`, with the trailing slash removed.
         */
        removeTrailingSlash : function( anchorText ) {
            if( anchorText.charAt( anchorText.length - 1 ) === '/' ) {
                anchorText = anchorText.slice( 0, -1 );
            }
            return anchorText;
        }
        
    } );

    return Autolinker;
}