import type { Sequelize } from 'sequelize'
import type { entitiesAttributes, entitiesCreationAttributes } from './entities'
import { entities as _entities } from './entities'
import type { spellsAttributes, spellsCreationAttributes } from './spells'
import { spells as _spells } from './spells'
import type { eventsAttributes, eventsCreationAttributes } from './events'
import { events as _events } from './events'
import {videoDetail as _videoDetail} from "./videoDetail"
import {videoAttributes} from "./videoDetail"
import type {
  deployedSpellsAttributes,
  deployedSpellsCreationAttributes,
} from './deployedSpells'
import { deployedSpells as _deployedSpells } from './deployedSpells'
import type {
  documentsAttributes,
  documentsCreationAttributes,
} from './documents'
import { documents as _documents } from './documents'
import type {
  documentsStoreAttributes,
  documentsStoreCreationAttributes,
} from './documentstores'
import { documentsStore as _documentsStore } from './documentstores'
import type {
  contentObjAttributes,
  contentObjCreationAttributes,
} from './content_objects'
import { contentObj as _contentObj } from './content_objects'
import type {
  clientSettingCreationAttributes,
  clientSettingAttributes,
} from './client_settings'
import { clientSettings as _clientSettings } from './client_settings'
import type {
  configurationSettingAttributes,
  configurationSettingCreationAttributes,
} from './configuration_setting'
import { configurationSettings as _configurationSettings } from './configuration_setting'
import type {
  scopeSettingAttributes,
  scopeSettingCreationAttributes,
} from './scope_settings'
import { scopeSettings as _scopeSettings } from './scope_settings'
import type {
  calendarEventsAttributes,
  calendarEventsCreationAttributes,
} from './calendarEvents'
import { calendarEvents as _calendarEvents } from './calendarEvents'
import type {
  authUsersAttributes,
  authUsersAttributesCreationAttributes,
} from './authUsers'
import { authUsers as _authUsers } from './authUsers'
import {
  message_reactions as _message_reactions,
  messageReactionsAttributes,
  messageReactionCreationAttributes,
} from './message_reactions'

export {
  _entities as entities,
  _spells as spells,
  _videoDetail as video_detail,
  _events as events,
  _deployedSpells as deployedSpells,
  _documents as documents,
  _documentsStore as documentsStore,
  _contentObj as contentObj,
  _clientSettings as clientSettings,
  _configurationSettings as configurationSettings,
  _scopeSettings as scopeSettings,
  _calendarEvents as calendarEvents,
  _authUsers as authUsers,
  _message_reactions as messageReactions,
}

export type {
  entitiesAttributes,
  entitiesCreationAttributes,
  spellsAttributes,
  spellsCreationAttributes,
  eventsAttributes,
  videoAttributes,
  eventsCreationAttributes,
  deployedSpellsAttributes,
  deployedSpellsCreationAttributes,
  documentsAttributes,
  documentsCreationAttributes,
  documentsStoreAttributes,
  documentsStoreCreationAttributes,
  contentObjAttributes,
  contentObjCreationAttributes,
  clientSettingCreationAttributes,
  clientSettingAttributes,
  configurationSettingAttributes,
  configurationSettingCreationAttributes,
  scopeSettingAttributes,
  scopeSettingCreationAttributes,
  calendarEventsAttributes,
  calendarEventsCreationAttributes,
  authUsersAttributes,
  messageReactionsAttributes,
  messageReactionCreationAttributes,
}

export function initModels(sequelize: Sequelize) {
  const entities = _entities.initModel(sequelize)
  const spells = _spells.initModel(sequelize)
  const events = _events.initModel(sequelize)
  const deployedSpells = _deployedSpells.initModel(sequelize)
  const documentsStore = _documentsStore.initModel(sequelize)
  const documents = _documents.initModel(sequelize)
  const contentObj = _contentObj.initModel(sequelize)
  const clientSettings = _clientSettings.initModel(sequelize)
  const configurationSettings = _configurationSettings.initModel(sequelize)
  const scopeSettings = _scopeSettings.initModel(sequelize)
  const calendarEvents = _calendarEvents.initModel(sequelize)
  const authUsers = _authUsers.initModel(sequelize)
  const messageReactions = _message_reactions.initModel(sequelize)
  const video_detail = _videoDetail.initModel(sequelize)

  return {
    entities: entities,
    spells: spells,
    events: events,
    deployedSpells: deployedSpells,
    contentObj: contentObj,
    documents: documents,
    documentsStore: documentsStore,
    clientSettings: clientSettings,
    configurationSettings: configurationSettings,
    scopeSettings: scopeSettings,
    calendarEvents: calendarEvents,
    authUsers: authUsers,
    messageReactions,
    video_detail: video_detail
  }
}
