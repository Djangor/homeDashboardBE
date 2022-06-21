import { Injectable } from '@nestjs/common';
import { CONSTANTS } from "../Constants";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { google } from "googleapis";
import * as fs from "fs";
import * as readline from "readline";


const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.events.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/tasks.readonly',
];
const TOKEN_PATH = './token.json';


@Injectable()
export class GoogleService {

  constructor(private httpService: HttpService) {}

  cachedCalendarEntry: object[];
  cachedCalendarTSD: number;
  cachedTaskEntry: object[];
  cachedTaskTSD: number;

  getCalendarEntries(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const currNow = Date.now();
      if (currNow - this.cachedCalendarTSD < CONSTANTS.google.cacheMS && this.cachedCalendarEntry && this.cachedCalendarEntry.length > 0) {
        console.log('taking cached entries');
        resolve(this.cachedCalendarEntry);
      } else {
        fs.readFile('./credentials.json', (err, content) => {
          if (err) return console.log('Error loading client secret file:', err);
          // Authorize a client with credentials, then call the Google Drive API.
          this.authorize(JSON.parse(content.toString()))
            .then(auth => {
              console.log('authed');
              resolve(this.listEvents(auth));
            })
            .catch(err => {
              console.log(err);
              reject(err);
            })
        });
      }
    })
  }

  getTaskEntries(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const currNow = Date.now();
      if (currNow - this.cachedTaskTSD < CONSTANTS.google.cacheMS && this.cachedTaskEntry && this.cachedTaskEntry.length > 0) {
        console.log('taking cached entries');
        resolve(this.cachedTaskEntry);
      } else {
        fs.readFile('./credentials.json', (err, content) => {
          if (err) return console.log('Error loading client secret file:', err);
          // Authorize a client with credentials, then call the Google Drive API.
          this.authorize(JSON.parse(content.toString()))
            .then(auth => {
              console.log('authed');
              resolve(this.listTasks(auth));
            })
            .catch(err => {
              console.log(err);
              reject(err);
            })
        });
      }
    })
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize(credentials) {
    return new Promise<any>((resolve,reject) => {
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) reject(this.getAccessToken(oAuth2Client));
        oAuth2Client.setCredentials(JSON.parse(token.toString()));
        resolve(oAuth2Client);
      });
    })
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
      });
    });
  }

  getAuthorizationUrl() {
    return new Promise<any> (resolve => {
      fs.readFile('./credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        const {client_secret, client_id, redirect_uris} = JSON.parse(content.toString()).installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline', scope: SCOPES, });
        resolve(authUrl);
      });
    })
  }

  setAccessCode(code) {
    return new Promise<any> (resolve => {
      fs.readFile('./credentials.json', (err, content) => {
        if (err) resolve({status: 'error', message: 'Error loading client secret file:', err});
        const {client_secret, client_id, redirect_uris} = JSON.parse(content.toString()).installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        // Authorize a client with credentials, then call the Google Drive API.
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error('Error retrieving access token', err);
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) resolve({ status: 'error', error: err });
            console.log('Token stored to', TOKEN_PATH);
            resolve( { status: 'ok', message: 'token stored' })
          });
        });
      });
    });
  }

  static pad(n){
    console.log(n);
    return n<10 ? '0'+n : n}

  static ISODateString(d){
    console.log(d);
    return
  }


  /**
   * Lists the names and IDs of up to 10 files.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  async listEvents(auth) {
    const cal = google.calendar({version: 'v3', auth});
    const d = new Date();
    function pad(n){
      return n<10 ? '0'+n : n}
    const minDate = d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z';
    const entries = await cal.events.list({
      maxResults: 10,
      showDeleted: false,
      orderBy: 'startTime',
      singleEvents: true,
      timeMin: minDate,
      timeZone: 'Asia/Bangkok',
      calendarId: CONSTANTS.google.calendarId
    });
    const mappedEntries = entries.data.items.map(entry => {
      return {title: entry.summary, start: entry.start.dateTime, end: entry.end.dateTime};
    })
    this.cachedCalendarEntry = mappedEntries;
    this.cachedCalendarTSD = Date.now();
    return mappedEntries;
  }

  async listTasks(auth) {
    const tasks = google.tasks({version: 'v1', auth});
    const d = new Date();
    if (!CONSTANTS.google.tasklistId || CONSTANTS.google.tasklistId === '') {
      const res = await tasks.tasklists.list({});
      return res.data;
    } else {
      const entries = await tasks.tasks.list({
        maxResults: 10,
        tasklist: CONSTANTS.google.tasklistId
      });
      const mappedEntries = entries.data.items.map(entry => {
        return {title: entry.title, dueDate: entry.due, notes: entry.notes};
      })
      this.cachedTaskEntry = mappedEntries;
      this.cachedTaskTSD = Date.now();
      return mappedEntries;
    }
  }

}

