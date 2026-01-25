import { postgresAdapter } from '@payloadcms/db-postgres'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { Code } from './blocks/Code/config'
import { Accomplishments } from './collections/Accomplishments'
import { Activity } from './collections/Activity'
import { Blog } from './collections/Blog'
import { BlogViews } from './collections/BlogViews'
import { Educations } from './collections/Educations'
import { Languages } from './collections/Languages'
import { Media } from './collections/Media'
import { Organizations } from './collections/Organizations'
import { Profile } from './collections/Profile'
import { Projects } from './collections/Projects'
import { Prompts } from './collections/Prompts'
import { Referrals } from './collections/Referrals'
import { SocialLinks } from './collections/SocialLinks'
import { Technologies } from './collections/Technologies'
import { TestScores } from './collections/TestScores'
import { Users } from './collections/Users'
import { Visitors } from './collections/Visitors'
import { WorkExperience } from './collections/WorkExperience'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Indonesian',
        code: 'id',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Accomplishments,
    Activity,
    Blog,
    BlogViews,
    Educations,
    Languages,
    Media,
    Organizations,
    Profile,
    Projects,
    Prompts,
    Referrals,
    SocialLinks,
    Technologies,
    TestScores,
    Users,
    Visitors,
    WorkExperience,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [Code],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      ssl: {
        rejectUnauthorized: false, // Required for Supabase/Neon in some environments
      },
    },
    idType: 'uuid',
    schemaName: process.env.DB_SCHEMA || 'dtavv',
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || '',
        endpoint: process.env.S3_ENDPOINT || '',
        forcePathStyle: true,
      },
    }),
  ],
})
