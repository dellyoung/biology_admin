import Layout from '@/layouts/index.vue';
import ListIcon from '@/assets/assets-slide-list.svg';

export default [
  {
    path: '/core',
    name: 'list',
    component: Layout,
    redirect: '/list/base',
    meta: { title: '数据转换', icon: ListIcon },
    children: [
      {
        path: 'base',
        name: 'ListBase',
        component: () => import('@/pages/core/excel/index.vue'),
        // import('@/pages/dashboard/base/index.vue'),
        meta: { title: '普通数据页' },
      },
    ],
  },
  // {
  //   path: '/user',
  //   name: 'user',
  //   component: Layout,
  //   redirect: '/user/index',
  //   meta: { title: '个人页', icon: 'user-circle' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'UserIndex',
  //       component: () => import('@/pages/user/index.vue'),
  //       meta: { title: '个人中心' },
  //     },
  //   ],
  // },
  // {
  //   path: '/loginRedirect',
  //   name: 'loginRedirect',
  //   redirect: '/login',
  //   meta: { title: '登录页', icon: LogoutIcon },
  //   component: () => import('@/layouts/blank.vue'),
  //   children: [
  //     {
  //       path: 'index',
  //       redirect: '/login',
  //       component: () => import('@/layouts/blank.vue'),
  //       meta: { title: '登录中心' },
  //     },
  //   ],
  // },
];
