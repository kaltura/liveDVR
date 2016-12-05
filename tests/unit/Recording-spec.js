/**
 * Created by ron.yadgar on 24/11/2016.
 */
const proxyquire = require('proxyquire');
const fs = require('fs');
const Q = require('q');
const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const sinon = require('sinon');
const config = require('./../../common/Configuration');
const kalturaTypes = require('../../lib/kaltura-client-lib/KalturaTypes');
const qio = require('q-io/fs');
describe('Session manager spec', () =>{

    let recordingConfigurationObj = config.get('recording')
    recordingConfigurationObj.recordingFolderPath = path.join(__dirname, '..','resources')
    config.set('recording', recordingConfigurationObj)
    let entryObj = {}
    entryObj.entryId = '0_dv6q5l87'
    entryObj.recordedEntryId = '0_uy8h6jmv'
    entryObj.recordStatus = kalturaTypes.KalturaRecordStatus.APPENDED
    let flavorsObjArray = []


    it('should check', (done)=>{
        let meta_data =JSON.parse(fs.readFileSync(path.join(recordingConfigurationObj.recordingFolderPath, 'getMetaData.json')))
        let downloadChunks = JSON.parse(fs.readFileSync(path.join(recordingConfigurationObj.recordingFolderPath, 'downloadChunks')))
        let cb = function(){
            return downloadChunks
        }
        let mocks = {
            'q-io/fs' : {
                exists : sinon.stub().returns(Q(true)),
                makeTree : sinon.stub().returns(Q()),
                rename : sinon.stub().returns(Q.resolve()),
                stat : sinon.stub().returns(Q.resolve({
                    size : 1
                }))
            }
            ,
           'glob' : sinon.stub().callsArgWith(1, null, cb())
            ,
            '../utils/mp4-utils.js' : {
                extractMetadata : function (filePath) {
                    let result
                    _.each(meta_data, (element)=>{
                        if (element.path == filePath){
                            result = element
                            return;
                        }
                    })
                    return Q.resolve(result)
                }
            }
        };
        const RecordingEntrySession = proxyquire('../../lib/recording/RecordingEntrySession.js', mocks)
        let recordingEntrySession = new RecordingEntrySession(entryObj, flavorsObjArray)
        let playlistTemplatePath = path.join(recordingEntrySession.recordingSessionPath, 'playlist.json.template')
        let playlistPath = path.join(recordingEntrySession.recordingSessionPath, 'playlist.json')
        return qio.copy(playlistTemplatePath, playlistPath)
            .then(()=> {
                return recordingEntrySession.accessibleRecording()
            })
            .then(()=>{
                let missingChunks = recordingEntrySession.checkMissingChunks(downloadChunks)
                if (missingChunks.length !== meta_data.length){
                    throw new Error("Missing chunks are not equal to download chunks")
                }
                return recordingEntrySession.checkFilesFromRecordingFolder()
            })
            .then(()=>{
                let missingChunks = recordingEntrySession.checkMissingChunks(downloadChunks)
                if (missingChunks.length !== 0){
                    throw new Error("Missing chunks are 0")
                }
                return qio.remove((playlistPath))
            })
            .then(()=>{
                done()
            })

        })


    it('live', (done)=>{
        let meta_data =JSON.parse(fs.readFileSync(path.join(recordingConfigurationObj.recordingFolderPath, 'getMetaData.json')))
        let downloadChunks = JSON.parse(fs.readFileSync(path.join(recordingConfigurationObj.recordingFolderPath, 'downloadChunks')))
        let cb = function(){
            return downloadChunks
        }
        let mocks = {
            'q-io/fs' : {
                exists : sinon.stub().returns(Q(true)),
                makeTree : sinon.stub().returns(Q()),
                rename : sinon.stub().returns(Q.resolve()),
                link : sinon.stub().returns(Q.resolve()),
                stat : sinon.stub().returns(Q.resolve({
                    size : 1
                }))
            }
            ,
            'glob' : sinon.stub().callsArgWith(1, null, cb())
            ,
            '../utils/mp4-utils.js' : {
                extractMetadata : function (filePath) {
                    let result
                    _.each(meta_data, (element)=>{
                        if (element.path == filePath){
                            result = element
                            return;
                        }
                    })
                    return Q.resolve(result)
                }
            }
        };
        const RecordingEntrySession = proxyquire('../../lib/recording/RecordingEntrySession.js', mocks)
        let recordingEntrySession = new RecordingEntrySession(entryObj, flavorsObjArray)
        let playlistTemplatePath = path.join(recordingEntrySession.recordingSessionPath, 'playlist.json.template')
        let playlistPath = path.join(recordingEntrySession.recordingSessionPath, 'playlist.json')
        return qio.copy(playlistTemplatePath, playlistPath)
            .then(()=> {
                return recordingEntrySession.accessibleRecording()
            })
            .then(()=>{
                let missingChunks = recordingEntrySession.checkMissingChunks(downloadChunks)
                if (missingChunks.length !== meta_data.length){
                    throw new Error("Missing chunks are not equal to download chunks")
                }
                return recordingEntrySession.checkFilesFromLiveFolder()
            })
            .then(()=>{
                let missingChunks = recordingEntrySession.checkMissingChunks(downloadChunks)
                if (missingChunks.length !== 0){
                    throw new Error("Missing chunks are 0")
                }
                return qio.remove((playlistPath))
            })
            .then(()=>{
                done()
            });

    })

})