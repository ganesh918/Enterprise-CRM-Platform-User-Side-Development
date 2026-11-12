import { migrateStoredAuth } from '../features/auth/authSlice'
import { purgeLegacyCrmStorage } from './persist'

purgeLegacyCrmStorage()
migrateStoredAuth()
