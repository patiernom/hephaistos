'use strict';

var ApiciApi = require('api'),
    ApiManager = require('api-response-manager'),
    Boom = require('boom'),
    failFast = require('fp-error-handling'),
    R = require('ramda'),
    webnodesManager = require('webnodes-manager'),
    async = require('async');

module.exports = function (server) {
    let Api = ApiciApi(server);

    var getResult = ApiManager.getResponse,
        getErrorMessage = ApiManager.getError,
        createSession = function () {
            return {
                navigation: {
                    visit: 1
                }
            };
        },
        getListOfTraks = function (apikey, callback) {
            let onSuccess = (apiResult) => {
                callback(null, getResult(apiResult));
            };

            let onError = (err) => {
                let error = Boom.create(err.status, getErrorMessage(err));
                callback(error);
            };

            Api.Chart.TracksGet(apikey, "IT", 1, 100, "json", true, failFast(onError, onSuccess));
        },
        getListOfArtists = function (apikey, callback) {
            let onSuccess = (apiResult) => {
                callback(null, getResult(apiResult));
            };

            let onError = (err) => {
                let error = Boom.create(err.status, getErrorMessage(err));
                callback(error);
            };

            Api.Chart.ArtistsGet(apikey, "IT", 1, 100, "json", failFast(onError, onSuccess));
        },
        responseView = function (rpl, request) {
            const API_KEY = '327338f4ab2909cc6003022f7056c5d3';

            let onError = (err) => {
                rpl(err);
            };

            var visit = createSession(),
                data = createSession(),
                manager = webnodesManager(request),
                auth = manager.authentication.getAuth(),
                artifacts = manager.artifacts;

            let onSuccess = (apiResult) => {
                data.trackList = apiResult[0].track_list;
                data.artistList = apiResult[1].artist_list;
                data.selectedTrack = data.trackList[Math.floor(Math.random()*data.trackList.length)].track;

                Api.Track.LyricsGet(API_KEY, data.selectedTrack.track_id, data.selectedTrack.track_mbid, "json", failFast(onError, getView));
            };

            let getView = (apiResult) => {
                data.selectedTrack.lyrics = getResult(apiResult).lyrics;

                data.quizId = data.selectedTrack.track_id;
                data.quizText = data.selectedTrack.lyrics.lyrics_body.substring(0, 100) + ' ...';
                var p1 = data.artistList[Math.floor(Math.random()*data.artistList.length)].artist;
                var p2 = data.artistList[Math.floor(Math.random()*data.artistList.length)].artist;

                data.artists = [
                    {name:data.selectedTrack.artist_name, id: data.selectedTrack.artist_id},
                    {name:p1.artist_name, id: p1.artist_id},
                    {name:p2.artist_name, id: p2.artist_id}
                ];

                if (auth.isAuthenticated) {
                    data.user = auth.credentials;
                }
                data.currentLanguage = manager.language.getCurrentLanguage();
                data.navigation.search = {};
                data = R.merge(data, artifacts.loadStylesheets());
                data = R.merge(data, artifacts.loadJavascript());
                rpl.view('quiz', data).state('visit', visit);
            };

            async.series(
                [
                    (next) => {
                        getListOfTraks(API_KEY, next);
                    },
                    (next) => {
                        getListOfArtists(API_KEY, next);
                    }
                ], failFast(onError, onSuccess)
            );

        };

    return {
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        state: {
            parse: true, // parse and store in request.state
            failAction: 'error' // may also be 'ignore' or 'log'
        },
        handler: function (request, reply) {
            responseView(reply, request);
        }
    };
};
