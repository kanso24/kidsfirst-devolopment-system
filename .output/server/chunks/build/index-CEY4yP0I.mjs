import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, createTextVNode, computed, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { Primitive } from 'reka-ui';
import { r as useAuth, e as _sfc_main$d, f as _sfc_main$8, g as useAppConfig, h as useComponentUI, t as tv } from './server.mjs';
import { _ as _sfc_main$2 } from './Card-DknAj2mS.mjs';
import { u as useFetch } from './fetch-Cu8xFSBp.mjs';
import '../nitro/nitro.mjs';
import 'jsonwebtoken';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@vue/shared';

const theme = {
  "base": "animate-pulse rounded-md bg-elevated"
};
const _sfc_main$1 = {
  __name: "USkeleton",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: Object, required: false }
  },
  setup(__props) {
    const props = __props;
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("skeleton", props);
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.skeleton || {} }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        "aria-busy": "true",
        "aria-label": "loading",
        "aria-live": "polite",
        role: "alert",
        class: ui.value({ class: [unref(uiProp)?.base, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Skeleton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { user } = useAuth();
    const { data: summaryData, pending, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/reports/summary",
      {
        lazy: true
      },
      "$14NDNr8QEG"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USkeleton = _sfc_main$1;
      const _component_UCard = _sfc_main$2;
      const _component_UIcon = _sfc_main$d;
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back, ${ssrInterpolate(unref(user)?.firstname)}! Here&#39;s what&#39;s happening today.</p></div></div>`);
      if (unref(pending)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-32 w-full" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-32 w-full" }, null, _parent));
        _push(`</div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400"> Failed to load dashboard summary. </div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`);
        _push(ssrRenderComponent(_component_UCard, { ui: { body: { padding: "px-4 py-5 sm:p-6" } } }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center"${_scopeId}><div class="flex-shrink-0 p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-users",
                class: "h-6 w-6 text-violet-600 dark:text-violet-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="ml-5 w-0 flex-1"${_scopeId}><dl${_scopeId}><dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"${_scopeId}>Total Users</dt><dd class="flex items-baseline"${_scopeId}><div class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(summaryData)?.summary.totalUsers || 0)}</div></dd></dl></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("div", { class: "flex-shrink-0 p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-users",
                      class: "h-6 w-6 text-violet-600 dark:text-violet-400"
                    })
                  ]),
                  createVNode("div", { class: "ml-5 w-0 flex-1" }, [
                    createVNode("dl", null, [
                      createVNode("dt", { class: "text-sm font-medium text-gray-500 dark:text-gray-400 truncate" }, "Total Users"),
                      createVNode("dd", { class: "flex items-baseline" }, [
                        createVNode("div", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(summaryData)?.summary.totalUsers || 0), 1)
                      ])
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, { ui: { body: { padding: "px-4 py-5 sm:p-6" } } }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center"${_scopeId}><div class="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-graduation-cap",
                class: "h-6 w-6 text-blue-600 dark:text-blue-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="ml-5 w-0 flex-1"${_scopeId}><dl${_scopeId}><dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"${_scopeId}>Total Students</dt><dd class="flex items-baseline"${_scopeId}><div class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(summaryData)?.summary.totalStudents || 0)}</div></dd></dl></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("div", { class: "flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-graduation-cap",
                      class: "h-6 w-6 text-blue-600 dark:text-blue-400"
                    })
                  ]),
                  createVNode("div", { class: "ml-5 w-0 flex-1" }, [
                    createVNode("dl", null, [
                      createVNode("dt", { class: "text-sm font-medium text-gray-500 dark:text-gray-400 truncate" }, "Total Students"),
                      createVNode("dd", { class: "flex items-baseline" }, [
                        createVNode("div", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(summaryData)?.summary.totalStudents || 0), 1)
                      ])
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, { ui: { body: { padding: "px-4 py-5 sm:p-6" } } }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center"${_scopeId}><div class="flex-shrink-0 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-list-checks",
                class: "h-6 w-6 text-green-600 dark:text-green-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="ml-5 w-0 flex-1"${_scopeId}><dl${_scopeId}><dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"${_scopeId}>Total Question Groups</dt><dd class="flex items-baseline"${_scopeId}><div class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(summaryData)?.summary.totalQuestionGroups || 0)}</div></dd></dl></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("div", { class: "flex-shrink-0 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-list-checks",
                      class: "h-6 w-6 text-green-600 dark:text-green-400"
                    })
                  ]),
                  createVNode("div", { class: "ml-5 w-0 flex-1" }, [
                    createVNode("dl", null, [
                      createVNode("dt", { class: "text-sm font-medium text-gray-500 dark:text-gray-400 truncate" }, "Total Question Groups"),
                      createVNode("dd", { class: "flex items-baseline" }, [
                        createVNode("div", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(summaryData)?.summary.totalQuestionGroups || 0), 1)
                      ])
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, { ui: { body: { padding: "px-4 py-5 sm:p-6" } } }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center"${_scopeId}><div class="flex-shrink-0 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-clipboard-check",
                class: "h-6 w-6 text-orange-600 dark:text-orange-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="ml-5 w-0 flex-1"${_scopeId}><dl${_scopeId}><dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"${_scopeId}>Total Assessments</dt><dd class="flex items-baseline"${_scopeId}><div class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(summaryData)?.summary.totalAssessments || 0)}</div></dd></dl></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("div", { class: "flex-shrink-0 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-clipboard-check",
                      class: "h-6 w-6 text-orange-600 dark:text-orange-400"
                    })
                  ]),
                  createVNode("div", { class: "ml-5 w-0 flex-1" }, [
                    createVNode("dl", null, [
                      createVNode("dt", { class: "text-sm font-medium text-gray-500 dark:text-gray-400 truncate" }, "Total Assessments"),
                      createVNode("dd", { class: "flex items-baseline" }, [
                        createVNode("div", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(summaryData)?.summary.totalAssessments || 0), 1)
                      ])
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      if (unref(summaryData)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center justify-between"${_scopeId}><h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white"${_scopeId}>Recent Students</h3>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/students",
                color: "gray",
                variant: "ghost",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`View all`);
                  } else {
                    return [
                      createTextVNode("View all")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("h3", { class: "text-base font-semibold leading-6 text-gray-900 dark:text-white" }, "Recent Students"),
                  createVNode(_component_UButton, {
                    to: "/students",
                    color: "gray",
                    variant: "ghost",
                    size: "sm"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("View all")
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul role="list" class="divide-y divide-gray-200 dark:divide-gray-800"${_scopeId}><!--[-->`);
              ssrRenderList(unref(summaryData).recent.students, (student) => {
                _push2(`<li class="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="flex flex-col"${_scopeId}><p class="text-sm font-medium text-violet-600 dark:text-violet-400 truncate"${_scopeId}>${ssrInterpolate(student.firstname)} ${ssrInterpolate(student.lastname)}</p><div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-calendar",
                  class: "flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500"
                }, null, _parent2, _scopeId));
                _push2(`<p${_scopeId}>Age: ${ssrInterpolate(student.age)}</p></div></div><div class="ml-2 flex flex-shrink-0"${_scopeId}><p class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>Added ${ssrInterpolate(new Date(student.createdAt).toLocaleDateString())}</p></div></div></li>`);
              });
              _push2(`<!--]-->`);
              if (!unref(summaryData).recent.students.length) {
                _push2(`<li class="py-4 text-sm text-gray-500 text-center"${_scopeId}>No students found.</li>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</ul>`);
            } else {
              return [
                createVNode("ul", {
                  role: "list",
                  class: "divide-y divide-gray-200 dark:divide-gray-800"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(summaryData).recent.students, (student) => {
                    return openBlock(), createBlock("li", {
                      key: student.id,
                      class: "px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("div", { class: "flex flex-col" }, [
                          createVNode("p", { class: "text-sm font-medium text-violet-600 dark:text-violet-400 truncate" }, toDisplayString(student.firstname) + " " + toDisplayString(student.lastname), 1),
                          createVNode("div", { class: "mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400" }, [
                            createVNode(_component_UIcon, {
                              name: "i-lucide-calendar",
                              class: "flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500"
                            }),
                            createVNode("p", null, "Age: " + toDisplayString(student.age), 1)
                          ])
                        ]),
                        createVNode("div", { class: "ml-2 flex flex-shrink-0" }, [
                          createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, "Added " + toDisplayString(new Date(student.createdAt).toLocaleDateString()), 1)
                        ])
                      ])
                    ]);
                  }), 128)),
                  !unref(summaryData).recent.students.length ? (openBlock(), createBlock("li", {
                    key: 0,
                    class: "py-4 text-sm text-gray-500 text-center"
                  }, "No students found.")) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(user)?.role === "admin") {
          _push(ssrRenderComponent(_component_UCard, null, {
            header: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center justify-between"${_scopeId}><h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white"${_scopeId}>Recent Users</h3>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  to: "/users",
                  color: "gray",
                  variant: "ghost",
                  size: "sm"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`View all`);
                    } else {
                      return [
                        createTextVNode("View all")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("h3", { class: "text-base font-semibold leading-6 text-gray-900 dark:text-white" }, "Recent Users"),
                    createVNode(_component_UButton, {
                      to: "/users",
                      color: "gray",
                      variant: "ghost",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("View all")
                      ]),
                      _: 1
                    })
                  ])
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<ul role="list" class="divide-y divide-gray-200 dark:divide-gray-800"${_scopeId}><!--[-->`);
                ssrRenderList(unref(summaryData).recent.users, (u) => {
                  _push2(`<li class="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="flex flex-col"${_scopeId}><p class="text-sm font-medium text-violet-600 dark:text-violet-400 truncate"${_scopeId}>${ssrInterpolate(u.firstname)} ${ssrInterpolate(u.lastname)}</p><div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-at-sign",
                    class: "flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500"
                  }, null, _parent2, _scopeId));
                  _push2(`<p${_scopeId}>${ssrInterpolate(u.username)} (${ssrInterpolate(u.role)})</p></div></div><div class="ml-2 flex flex-shrink-0"${_scopeId}><p class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>Added ${ssrInterpolate(new Date(u.createdAt).toLocaleDateString())}</p></div></div></li>`);
                });
                _push2(`<!--]-->`);
                if (!unref(summaryData).recent.users.length) {
                  _push2(`<li class="py-4 text-sm text-gray-500 text-center"${_scopeId}>No users found.</li>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</ul>`);
              } else {
                return [
                  createVNode("ul", {
                    role: "list",
                    class: "divide-y divide-gray-200 dark:divide-gray-800"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(summaryData).recent.users, (u) => {
                      return openBlock(), createBlock("li", {
                        key: u.id,
                        class: "px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("div", { class: "flex flex-col" }, [
                            createVNode("p", { class: "text-sm font-medium text-violet-600 dark:text-violet-400 truncate" }, toDisplayString(u.firstname) + " " + toDisplayString(u.lastname), 1),
                            createVNode("div", { class: "mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400" }, [
                              createVNode(_component_UIcon, {
                                name: "i-lucide-at-sign",
                                class: "flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500"
                              }),
                              createVNode("p", null, toDisplayString(u.username) + " (" + toDisplayString(u.role) + ")", 1)
                            ])
                          ]),
                          createVNode("div", { class: "ml-2 flex flex-shrink-0" }, [
                            createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, "Added " + toDisplayString(new Date(u.createdAt).toLocaleDateString()), 1)
                          ])
                        ])
                      ]);
                    }), 128)),
                    !unref(summaryData).recent.users.length ? (openBlock(), createBlock("li", {
                      key: 0,
                      class: "py-4 text-sm text-gray-500 text-center"
                    }, "No users found.")) : createCommentVNode("", true)
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CEY4yP0I.mjs.map
