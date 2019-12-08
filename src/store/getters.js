const getters = {
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  token: state => state.user.token,
  info: state => state.user.info,

  permission_routes: state => state.permission.routes,

  rank: state => state.rank.rank,

  shorts: state => state.task.shorts,
  longs: state => state.task.longs
}
export default getters
