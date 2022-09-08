export default {
  app: {
    url: process.env.REACT_APP_SERVER_URL,
    version: 'Query.me (Beta) v0.5.0' // vX.Y.Z must be the same as in package.json
  },
  intercom: {
    appId: process.env.REACT_APP_INTERCOM_APPID
  },
  segment: {
    enabled: process.env.REACT_APP_SEGMENT_ENABLED
  }
}
