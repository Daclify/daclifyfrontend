const routes = [
  {
    path: '/',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: '', component: () => import('pages/home.vue') },
      { path: 'create', component: () => import('pages/create.vue') },
      { path: 'browse', component: () => import('pages/browse.vue') },
      { path: 'create/:newgroupname', component: () => import('pages/create.vue') },
      { path: 'tests', component: () => import('pages/tests.vue') },
      // { path: 'pricing', component: () => import('pages/pricing.vue') }
    ]
  },

  {
    path: '/documentation',
    component: () => import('layouts/DocsLayout.vue'),
    children: [
      { path: '', component: () => import('pages/docs/getting-started.vue') }
    ]
  },

  {
    path: '/manage/:groupname',
    component: () => import('layouts/GroupLayout.vue'),
    children: [
      { path: '', component: () => import('pages/manage/info.vue') },
      { path: 'guardians', component: () => import('pages/manage/guardians.vue') },
      { path: 'proposals', component: () => import('pages/manage/proposals.vue') },
      { path: 'new-proposal', component: () => import('pages/manage/new-proposal.vue') },
      { path: 'settings', component: () => import('pages/manage/settings.vue') },
      { path: 'wallet', component: () => import('pages/manage/wallet.vue') },
      { path: 'resources', component: () => import('pages/manage/resources.vue') },
      { path: 'thresholds', component: () => import('pages/manage/thresholds.vue') },
      { path: 'modules', component: () => import('pages/manage/modules.vue') },
      { path: 'payroll', component: () => import('pages/manage/payroll.vue') },
      { path: 'members', component: () => import('pages/manage/members.vue') },
      { path: 'files', component: () => import('pages/manage/files.vue') },
      { path: 'hooks', component: () => import('pages/manage/hooks.vue') },
    ]
  },

  {
    path: '/members/:groupname',
    component: () => import('layouts/GroupLayout.vue'),
    children: [
      { path: '', component: () => import('pages/manage/info.vue') },
      { path: 'dashboard', component: () => import('pages/members/dashboard.vue') },
      { path: 'elections', component: () => import('pages/members/elections.vue') },
      { path: 'register', component: () => import('pages/members/register.vue') },
      { path: 'my-tokens', component: () => import('pages/members/my-tokens.vue') },
      { path: 'profile/:accountname', component: () => import('pages/members/profile.vue') }

    ]
  },


]

// Always leave this as last one
if(process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes