/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app;
app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        app.pluginInitialize();
        app.bindNotificationEvents();


        // deviceready Event Handler
        //
        // Bind any cordova events here. Common events are:
        // 'pause', 'resume', etc.
        //onDeviceReady: function() {
        //this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    bindNotificationEvents: function () {
        cordova.plugins.notification.local.on('schedule', function (obj) {
            console.log('schedule', arguments);
            // showToast('scheduled: ' + obj.id);
        });
        cordova.plugins.notification.local.on('update', function (obj) {
            console.log('update', arguments);
            showToast('updated: ' + obj.id);
        });
        cordova.plugins.notification.local.on('trigger', function (obj) {
            console.log('trigger', arguments);
            showToast('triggered: ' + obj.id);
        });
        cordova.plugins.notification.local.on('click', function (obj) {
            console.log('click', arguments);
            showToast('clicked: ' + obj.id);
        });
        cordova.plugins.notification.local.on('cancel', function (obj) {
            console.log('cancel', arguments);
            // showToast('canceled: ' + obj.id);
        });
        cordova.plugins.notification.local.on('clear', function (obj) {
            console.log('clear', arguments);
            showToast('cleared: ' + obj.id);
        });
        cordova.plugins.notification.local.on('cancelall', function () {
            console.log('cancelall', arguments);
            // showToast('canceled all');
        });
        cordova.plugins.notification.local.on('clearall', function () {
            console.log('clearall', arguments);
            // showToast('cleared all');
        });
        cordova.plugins.notification.local.on('like', function () {
            console.log('like', arguments);
            showToast('liked');
        });
        cordova.plugins.notification.local.on('dislike', function () {
            console.log('dislike', arguments);
            showToast('disliked');
        });
        cordova.plugins.notification.local.on('feedback', function (obj, e) {
            console.log('feedback', arguments);
            showToast('Feedback: ' + e.text);
        });
    }

    };

app.initialize();