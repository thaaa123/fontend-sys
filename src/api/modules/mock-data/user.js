const userMenuList = [
  {
    code: '53',
    // 菜单名称
    title: '系统管理',
    // 菜单链接
    path: '',
    // 菜单类型 *
    type: 'menu',
    // 可见性
    hasPermission: true,
    iconStr: 'cog',
    // 路由名称
    routeName: '',
    // 路由组件
    routeComponent: '',
    childMenuList: [
      {
        code: '11111',
        title: '权限管理',
        path: '',
        type: 'menu',
        hasPermission: true,
        iconStr: 'user-circle',
        routeName: '',
        routeComponent: '',
        childMenuList: [
          {
            code: '11144',
            title: '用户管理',
            path: '/userManage',
            type: 'menu',
            hasPermission: true,
            iconStr: 'user-circle',
            routeName: 'userManage',
            routeComponent: 'jurisdictionManage/userManage'
          },
          {
            code: '1131',
            title: '角色管理',
            path: '/ruleManage',
            type: 'menu',
            hasPermission: true,
            iconStr: 'user-circle',
            routeName: 'ruleManage',
            routeComponent: 'jurisdictionManage/roleManage'
          }
        ]
      }
    ]
  }
]

export {
  userMenuList
}
