function loadFile(url, callback) {
    console.log('load file')
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
        firstName: 'Jason',
        lastName: 'Stearns',
        shortName: 'Jason S.',
        email: 'jstearns@caorda.com'
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


var registerTemplate = function(name) {
    var file = chrome.extension.getURL('src/views/' + name + '.html')
    $.when($.get(file))
    .done(function (data) {
        $.templates(name, data)
    })
}
registerTemplate('tasktable')

// $.templates('tasktable','<div class="foundation"><table class="fullwidth table-fixed"><caption>Assigned Tasks</caption><thead><tr><th style="width: 30px;"></th><th style="width: 110px;">Created</th><th style="width: 110px;">Due</th><th>Client</th><th>Title</th><th style="width: 110px;">Owner</th><th style="width: 60px;">Priority</th><th style="width: 60px;">Status</th><th style="width: 40px;"></th></tr</thead><tbody>{{for tasks}}<tr data-href="https://apps.caorda.com/dashboard/tasks/tasks.aspx?Action=LoadTask&TaskID={{:id}}"><td>{{:number}}</td><td>{{:created}}</td><td>{{:due}}</td><td>{{:clientName}} <a href="https://apps.caorda.com/dashboard/domains.aspx?DomainID={{:clientId}}" class="cell-action"><i class="fa fa-caret-right"></i></a></td><td>{{:name}}</td><td>{{:owner}}<a href="{{:emailLink}}" class="cell-action"><i class="fa fa-caret-right"></i></a></td><td style="text-align: center;"><span class="label warning round"><i class="fa fa-dot-circle-o"></i></span></td><td style="text-align: center;"><i class="fa fa-pause"></i></td><td class="button-cell"><a href="#" class="button"><i class="fa fa-caret-right"></i></a></td></tr>{{/for}}</tbody></table></div>')


// if(window.location.protocol != 'https:') {
//   location.href = location.href.replace("http://", "https://");
// }

$(document).ready(function () {
        console.log('ready')

        var toolbarToggled = parseInt(localStorage.getItem('caorda-dashboard-static-toolbar'),10)

        function isNumber(value) {
            return typeof value == 'number' || value && typeof value == 'object' && toString.call(value) == numberClass || false;
        }
        function isNaN(value) {
            return isNumber(value) && value != +value;
        }

        if(isNaN(toolbarToggled)) {
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


        var taskList = $('#ctl00_plcContentPlaceHolder_ctl00_plcContentPlaceHolder_pnlSelectAssignedPanel,#ctl00_plcContentPlaceHolder_ctl00_plcContentPlaceHolder_grdSelectPanel')[0]
        var timeEntries = $('#ctl00_plcContentPlaceHolder_ctl00_plcContentPlaceHolder_pnlSelectDailyPanel')[0]

            var taskListObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if(mutation.addedNodes) {
                        if(mutation.addedNodes[0]) {
                            if(mutation.addedNodes[0].id === "ctl00_plcContentPlaceHolder_pnlSelectAssigned") {
                                loadAssignedTasks()
                                loadSupportTasks()
                                taskMenuClickPopup()
                            }
                        }
                    }
                })
            })

            taskList && taskListObserver.observe(taskList, {childList: true})

            var timeEntriesObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if(mutation.addedNodes) {
                        if(mutation.addedNodes[0]) {
                            if(mutation.addedNodes[0].id === "ctl00_plcContentPlaceHolder_pnlSelectDaily") {
                                injectClock()
                            }
                        }
                    }
                })
            })

            timeEntries && timeEntriesObserver.observe(timeEntries, {childList: true})


            var $td, $clock, $hours, $minutes, start = new Date()

            function injectClock() {
                console.log('inject clock')
                var i, totalHours = 0, totalMinutes = 0

                ;(function (m){
                    if(m) {
                        totalMinutes = m[2]
                        totalHours = m[1]
                    }
                }(/^(?:([0-9]+)h\s)?(?:([0-9]+)m)$/.exec($('#ctl00_plcContentPlaceHolder_lblTotalTime').text())))

                if (JSON.parse(localStorage.getItem('startHours')) === null) {
                    localStorage.setItem('startHours', 8)
                }

                if (JSON.parse(localStorage.getItem('startMinutes')) === null) {
                    localStorage.setItem('startMinutes', 0)
                }

                $div = $('<div>')
                $clock = $('<span>')
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

                    var seconds = parseInt(diff / 1000)

                    var hours = parseInt(seconds / 3600, 10)
                    seconds = seconds % 3600

                    var minutes = parseInt(seconds / 60, 10)
                    seconds = seconds % 60

                    $clock.html('Worked: ' + (hours > 0 ? hours + 'h&nbsp;' : '') + (minutes > 0 ? minutes + 'm' : '0m'))
                }

                setInterval(updateClock, 200)
            }


            function loadAssignedTasks() {
                console.log('loadAssignedTasks')

                var tasks = getTasksFromTable($('#ctl00_plcContentPlaceHolder_grdSelectAssigned'))


                renderTaskTable('Assigned Tasks', tasks, true)

                
                function tasksLoadedFromTable() {
                    
                }

                function tasksLoadedFromStoreage() {

                } 

            }


            function mergeTasks() {

            }

            function renderTaskTable(title, tasks, showPriorityColumn) {

                var $taskTable = $($.render.tasktable({'title':title,'tasks':tasks, 'showPriorityColumn': showPriorityColumn}))

                $taskTable.find('[data-href]').on('click', function (e) {
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

                // $taskTable.find('[data-meta]').on('click', function (e) {
                //     var taskId = $(this).data('meta'), task, note

                //     task = _.find(tasks,function (task, i) {
                //         return task.id === taskId
                //     })

                //     console.log(task)

                //     note = $.trim(prompt('Task Note', task.meta.note || ''))

                //     console.log(note, task.meta.note)

                //     if( note !== null && note !== task.meta.note) {
                //         task.meta.note = note

                //         updateTaskMeta(taskId,{'note':task.meta.note})

                //     }

                //     e.stopPropagation()
                //     e.preventDefault()
                // })

                $('#ctl00_plcContentPlaceHolder_pnlSelectAssigned').before($taskTable)

            }

            // function updateTaskMeta(taskId, meta) {

            //     chrome.storage.local.get('taskMeta', function (data) {
            //         if ( !_.find(data.taskMeta,function (element, index) {
            //             if( taskId === element.taskId ) {
            //                 _.merge(element.meta, meta)
            //             }
            //         }) ) {
            //             data.taskMeta.push({'taskId':taskId,'meta':meta})
            //         }
            //         chrome.storage.local.set(data, function () {
            //             console.log('meta saved')
            //         })
            //     })
            // }


            function loadSupportTasks() {
                    console.log('loadSupportTasks')
                    $.get('//apps.caorda.com/dashboard/tasks/tasks.aspx?Action=LoadAssignee&AssigneeUserID=11626&TaskStatusID=2')
                    .done(function (data) {
                        var tasks = getTasksFromTable($(data).find('#ctl00_plcContentPlaceHolder_grdSelect'))
                        var savedTasks
                        renderTaskTable('Support Tasks', tasks)
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
                        onBudget: $(detailsTd[13]).text().indexOf('On Budget') >= 0,
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
                    }),

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



            function taskMenuClickPopup() {


                // console.log('clickable task menus')

                // $(document).off('click.task')

                // $('.clsNestedListMenu.clsTask li a').on('click',function () {
                //   console.log('task menu click')

                //   var $ul = $(this).siblings('ul')

                //   $ul.addClass('active')

                //   setTimeout(function () {
                //     $(document).on('click.task', function (e) {
                //       if($ul) {
                //         $ul.removeClass('active')
                //         $(document).off('click.task')
                //       }
                //     })
                //   },10)
                // })
            }

            loadAssignedTasks()
            loadSupportTasks()
            taskMenuClickPopup()
            injectClock()



        var $editor = $('#ctl00_plcContentPlaceHolder_radEditorDescription')
        if($editor[0]) {

            $editor.hide()

            var $textarea = $('#ctl00_plcContentPlaceHolder_radEditorDescriptionContentHiddenTextarea')


            var $description = $('<div id="description-display">')

            var description = decodeURIComponent($textarea[0].value)

            // description = description.replace(/^(<p([^<]+)*>(<span([^<]+)*>&nbsp;<\/span>|&nbsp;)<\/p>[ \t\r\n\f]*)+/,'')

            $description.html(description).find('a').attr('target','_blank')

            $editor.parent().append($description)


            var $edit = $('<a class="clsButton clsSmall clsBlue" href="#" style="display:inline-block;padding-left: 4px; padding-right: 4px;">Edit Description</a>')

            $editor.parent().prepend($edit)

            $edit.one('click', function (e) {
                $description.remove()
                $editor.show()
                $edit.remove()
            })


            var showNotes = $('#ctl00_plcContentPlaceHolder_lnkTaskNotes')[0], clickEvent = new MouseEvent('click')

            showNotes.dispatchEvent(clickEvent)


            $('#divTaskNotes table tr:nth-child(2) td:nth-child(2)').each(function(i, td) {
                console.log(td)
                // td.innerHTML = '<pre>' + td.innerHTML.slice(40, -37) + '</pre>'
                td.innerHTML = '<pre>' + td.innerHTML.trim() + '</pre>'


            })
        }


        var taskId = parseInt($.trim($('#ctl00_plcContentPlaceHolder_pnlProperties > div.clsContainer:nth-child(3) > table.clsStandard > tbody > tr:nth-child(1) > td:nth-child(6)').text()), 10)

        if(!_.isNaN(taskId)) {
            var savedTasks = chrome.storage.local.get('tasks')

            if(!savedTasks) {
                savedTasks = []
            }

            console.log('savedTasks',savedTasks)
            var task = _.find(savedTasks, function () {
                console.log(this.id)
                return this.id === taskId 
            })

            if(task) {
                console.log('task',task)
            }
        }




    })