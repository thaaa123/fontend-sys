export default {
  namespaced: true,
  state: {
    // 用户登录状态
    isLoading: false
  },
  mutations: {
    /**
     * @description 设置用户登陆状态
     * @param {Object} state state
     * @param {Boolean} value 是否登录
     */
    setIsLoading (state, value) {
      state.isLoading = value
    }
  }
}
