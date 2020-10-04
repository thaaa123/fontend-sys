import { mapState, mapActions } from 'vuex'

const pageMixin = {
  computed: {
    ...mapState('d2admin/page', [
      'opened',
      'current' // 用户获取当前页面的地址，用于关闭
    ])
  },
  methods: {
    ...mapActions('d2admin/page', [
      'close'
    ]),
    // 关闭当前页面
    closePage ({ gotoTagName, params = {}, query = {} }) {
      const tagName = this.current
      this.close({ tagName, gotoTagName, params, query })
    },
    // 清除页面缓存
    clearCache (tagName) {
      this.close({ tagName })
    }
  }
}

export default pageMixin
