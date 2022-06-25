// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import fs from 'fs'

import google from 'googleapis'
import path from 'path'
import DiscordClient from './discord'

import { getRelativeDate, isValidArray } from '../../utils/utils'
import { database } from '../../database'

const discord_client = new DiscordClient()

const { sendMessageToChannel } = discord_client

const CURRENT_SYNC_TOKEN_KEY = 'currentSyncToken'
const NEXT_SYNC_TOKEN_KEY = 'nextSyncToken'

export const testData = {
  summary: 'Google I/O 2015',
  location: '800 Howard St., San Francisco, CA 94103',
  description: "A chance to hear more about Google's developer products.",
  start: {
    dateTime: getRelativeDate({ daysOffset: 0, hour: 15 }).toJSON(),
    timeZone: 'America/Los_Angeles',
  },
  end: {
    dateTime: getRelativeDate({ daysOffset: 0, hour: 16 }).toJSON(),
    timeZone: 'America/Los_Angeles',
  },
  recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
}

// to generate a google token for dev mode,
// you can use https://developers.google.com/oauthplayground/

const rootDir = path.resolve(path.dirname(''))

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
]
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = rootDir + '/credentials/token.json'

export const initCalendar = async () => {
  // Load client secrets from a local file.
  const content: any = await fs.promises.readFile(
    rootDir + '/credentials/credentials.json',
    'binary'
  )
  // Authorize a client with credentials, then call the Google Calendar API.
  // authorize(JSON.parse(content), getCalendarEvents)
  // authorize(JSON.parse(content), deleteCalendarEvent)
  // authorize(JSON.parse(content), addCalendarEvent)
  return JSON.parse(content)
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
export const authorize = async (credentials: object, callback?: function) => {
  const { client_secret, client_id, redirect_uris } = credentials.web
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )

  // Check if we have previously stored a token.
  const token = await fs.promises.readFile(TOKEN_PATH, 'binary')

  if (!token) return callback('Token Couln`t find', null)
  oAuth2Client.setCredentials(JSON.parse(token))

  return oAuth2Client
}

/**
 * Add the calendar event in the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {object} eventDetails An authorized OAuth2 client.
 */
export const addCalendarEvent = async (
  auth: google.auth.OAuth2,
  eventDetails: object
) => {
  return await new Promise(async (resolve, reject) => {
    if (!auth) return console.log('Missing Token')

    const { summary, description, start, end, calendarId } = eventDetails

    const calendar = google.calendar({ version: 'v3', auth })
    return await calendar.events.insert(
      {
        calendarId: 'primary',
        resource: {
          summary: summary,
          description: description,
          start: {
            dateTime: start,
          },
          end: {
            dateTime: end,
          },
          ...eventDetails,
        },
      },
      callable
    )

    async function callable(err, res) {
      if (err) {
        console.log('There was an error contacting the Calendar service:', err)
        return resolve(null)
      }
      resolve(res)
    }
  })
}

/**
 * Sync events from Google Calendar
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export const syncCalendarEvents = async (auth: google.auth.OAuth2) => {
  return await new Promise(async (resolve, reject) => {
    if (!auth) return console.log('Missing Token')

    const calendar = google.calendar({ version: 'v3', auth })
    
    const { 
      id: currentTokenId, 
      value: currentToken 
    } = await database.instance.getConfigurationSettingByName(CURRENT_SYNC_TOKEN_KEY)
    const {
      id: nextTokenId,
      value: nextToken
    } = await database.instance.getConfigurationSettingByName(NEXT_SYNC_TOKEN_KEY)
    
    calendar.events.list(
      {
        calendarId: 'primary',
        syncToken: currentToken 
      },
      async (err, res) => {
        if (err) {
          console.log('The API returned an error: ' + err)
          resolve(null)
        }
        if(res.nextSyncToken) {
          await editSyncToken(
            currentTokenId,
            CURRENT_SYNC_TOKEN_KEY,
            nextToken
          )
          await editSyncToken(
            nextTokenId,
            NEXT_SYNC_TOKEN_KEY,
            res.nextSyncToken
          )
        }
        const eventsList = res.items
        
        if (isValidArray(eventsList)) {
          await eventsList
            .filter(e => e.status !== 'cancelled')
            .map(async (event) => {
              try {
                const [date, time] = event.start.dateTime.split('T')
                await database.instance.createCalendarEvent(
                  event.summary,
                  'primary',
                  date,
                  time,
                  event.eventType,
                  JSON.stringify(event)
                )
              } catch (err) {
                console.log('Error creating event :: ', err)
              }
            })         
          resolve(true)
        }
        resolve(null)
      }
    )
  })
}

/**
 * Lists the events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export const getCalendarEvents = async (auth: google.auth.OAuth2) => {
  return await new Promise(async (resolve, reject) => {
    if (!auth) return console.log('Missing Token')

    const calendar = google.calendar({ version: 'v3', auth })

    calendar.events.list(
      {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        singleEvents: true,
      },
      async (err, res) => {
        if (err) {
          console.log('The API returned an error: ' + err)
          reject(null)
        }
        if(res.nextSyncToken) {
          const { currentToken, nextToken } = await fetchSyncTokens()
          if(!currentToken && !nextToken) {
            await addSyncToken(CURRENT_SYNC_TOKEN_KEY, res.nextSyncToken)
            await addSyncToken(NEXT_SYNC_TOKEN_KEY, res.nextSyncToken)
          }
          if(currentToken && nextToken) {
           await editSyncToken(
            currentToken.id,
            CURRENT_SYNC_TOKEN_KEY,
            nextToken.value
           )
           await editSyncToken(
            nextToken.id,
            NEXT_SYNC_TOKEN_KEY,
            res.nextSyncToken
           )
          }
        }
        const eventsList = res.items

        if (isValidArray(eventsList)) {
          const updatedEvent = await eventsList
            .filter(e => e.status !== 'cancelled')
            .map((event, i) => {
              const eventDate = new Date(
                event.start.dateTime || event.start.date
              )
              const now = new Date()
              if (eventDate > now) {
                const diffMs = eventDate - now
                const diffMins = Math.round(
                  ((diffMs % 86400000) % 3600000) / 60000
                )
                if (diffMins <= 60 && diffMins > 0) {
                  console.log(
                    'Event',
                    i + 1,
                    ':',
                    event.summary,
                    'in',
                    diffMins,
                    'minutes'
                  )
                  return event
                }
                return null
              }
            })
            .filter(e => e)

          resolve(updatedEvent)
        }

        resolve(null)
      }
    )
  })
}

/**
 * Delete an event from the user's primary calendar
 * @param {google.auth.OAuth2} auth  An authorized OAuth2 client.
 * @param {string} eventId  ID of the Event
 */
export const deleteCalendarEvent = async (
  auth: google.auth.OAuth2,
  eventId: string
) => {
  return await new Promise(async (resolve, reject) => {
    if (!auth) return console.log('Missing Token')

    const calendar = google.calendar({ version: 'v3', auth })

    return await calendar.events.delete(
      {
        calendarId: 'primary',
        eventId,
      },
      async (err, res) => {
        if (err) {
          console.log('The API returned an error: ' + err)
          resolve(null)
        }
        resolve(true)
      }
    )
  })
}

/**
 * Fetch current sync token and next sync token from database
 */
const fetchSyncTokens = async () => {
  const currentToken = await database.instance.getConfigurationSettingByName(CURRENT_SYNC_TOKEN_KEY)
  const nextToken = await database.instance.getConfigurationSettingByName(NEXT_SYNC_TOKEN_KEY)
  return {
    currentToken: {
      id: currentToken.id,
      value: currentToken.value
    },
    nextToken: {
      id: nextToken.id,
      value: nextToken.value
    }
  }
}

/**
 * Add sync token in database
 * @param {string} key Key of the token
 * @param {string} value Value of the token
 */
const addSyncToken = async (key: string, value: string) => {
  return database.instance.addConfigurationSetting({ key, value })
}

/**
 * Edit sync token in database
 * @param {string} id ID of the token
 * @param {string} key Key of the token
 * @param {string} value Value of the token
 */
const editSyncToken = async (id: string, key: string, value: string) => {
  return database.instance.editConfigurationSetting({ id, key, value }, id)
}