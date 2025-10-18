import { RoutesAlias } from './routesAlias'
import { MenuListType } from '@/types/menu'
import { uuid } from '@/utils/utils'
import { upgradeLogList } from '@/mock/upgradeLog'

/**
 * 菜单列表、异步路由
 *
 * 支持两种模式:
 * 1. 前端静态配置 - 直接使用本文件中定义的路由配置
 * 2. 后端动态配置 - 后端返回菜单数据，前端解析生成路由
 *
 * 菜单标题（title）:
 * 可以是 i18n 的 key，也可以是字符串，比如：'用户列表'
 */
export const asyncRoutes: MenuListType[] = [
  {
    id: uuid(),
    path: '/console',
    name: 'Console',
    component: RoutesAlias.Dashboard,
    meta: {
      title: 'menus.dashboard.console',
      keepAlive: false,
      icon: '',
      isInMainContainer: true
    }
  },
  {
    id: uuid(),
    path: '/tool/gen-edit',
    name: 'GenEdit',
    component: RoutesAlias.Home,
    meta: {
      title: '修改生成配置',
      keepAlive: false,
      isHide: true
    },
    children: [
      {
        id: uuid(),
        path: 'index/:tableId(\\d+)',
        component: RoutesAlias.GenEdit,
        name: 'GenEditIndex',
        meta: { title: '修改生成配置', keepAlive: false }
      }
    ]
  },
  {
    id: uuid(),
    path: '/system/dict-data',
    name: 'DictData',
    component: RoutesAlias.Home,
    meta: {
      title: '字典数据',
      keepAlive: false,
      isHide: true
    },
    children: [
      {
        id: uuid(),
        path: 'index/:dictId(\\d+)',
        component: RoutesAlias.DictData,
        name: 'DictDataIndex',
        meta: { title: '字典数据', keepAlive: false }
      }
    ]
  },
  {
    id: uuid(),
    path: '/system/user-auth',
    name: 'UserAuth',
    component: RoutesAlias.Home,
    meta: {
      title: '分配角色',
      keepAlive: false,
      isHide: true
    },
    children: [
      {
        id: uuid(),
        path: 'role/:userId(\\d+)',
        component: RoutesAlias.AuthRole,
        name: 'AuthRole',
        meta: { title: '分配角色', keepAlive: false }
      }
    ]
  },
  {
    id: uuid(),
    path: '/trace',
    name: 'Trace',
    component: RoutesAlias.Trace,
    meta: { title: '溯源', keepAlive: false, isHide: true }
  },
  {
    id: uuid(),
    name: 'ChangeLog',
    path: '/log/changeLog',
    component: RoutesAlias.ChangeLog,
    meta: {
      title: 'menus.plan.log',
      showTextBadge: `${upgradeLogList.value[0].version}`,
      icon: '&#xe712;',
      keepAlive: false,
      isInMainContainer: true
    }
  }
]
