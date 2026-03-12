import { d as useRoute, c as useRouter, f as _sfc_main$8, e as _sfc_main$d } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-DknAj2mS.mjs';
import { _ as _sfc_main$2 } from './Table-C-wOHDbx.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, h, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { Radar } from 'vue-chartjs';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
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
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@tanstack/vue-table';
import '@tanstack/vue-virtual';
import '@vue/shared';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
    const route = useRoute();
    const router = useRouter();
    const { data, pending } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `/api/assessments/${route.params.id}`,
      "$uE9TD2zMLS"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const assessment = computed(() => data.value?.assessment);
    const getLevelClass = (level) => {
      switch (level) {
        case "Advanced":
          return "bg-purple-100 text-purple-800";
        case "Proficient":
          return "bg-green-100 text-green-800";
        case "Developing":
          return "bg-yellow-100 text-yellow-800";
        case "Emerging":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };
    const questionScoresList = computed(() => {
      if (!assessment.value?.domainScores) return [];
      const list = [];
      let index = 1;
      assessment.value.domainScores.forEach((ds) => {
        if (ds.questionScores) {
          ds.questionScores.forEach((qs) => {
            list.push({
              index: index++,
              questionText: qs.questionText,
              score: qs.score,
              level: ds.level,
              comment: qs.comment || "-"
            });
          });
        }
      });
      return list;
    });
    const maxScore = computed(() => {
      let max = 3;
      questionScoresList.value.forEach((q) => {
        if (q.score > max) max = q.score;
      });
      return max;
    });
    const chartData = computed(() => {
      if (!questionScoresList.value.length) return null;
      const scores = questionScoresList.value.map((q) => q.score);
      const labels = questionScoresList.value.map((q, i) => `Q${i + 1}`);
      return {
        labels,
        datasets: [
          {
            label: "Current Assessment",
            data: scores,
            backgroundColor: "rgba(139, 92, 246, 0.2)",
            borderColor: "rgba(139, 92, 246, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(139, 92, 246, 1)"
          }
        ]
      };
    });
    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          min: 0,
          max: maxScore.value,
          ticks: {
            stepSize: 1,
            callback: (value) => value.toFixed(0)
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UIcon = _sfc_main$d;
      const _component_UCard = _sfc_main$1;
      const _component_UTable = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="sm:flex sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Assessment Summary</h1><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(assessment)?.assessmentNumber)} - ${ssrInterpolate(unref(assessment)?.student?.firstname)} ${ssrInterpolate(unref(assessment)?.student?.lastname)}</p></div><div class="mt-4 sm:ml-4 sm:mt-0 flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-lucide-pencil",
        size: "lg",
        onClick: ($event) => unref(router).push(`/assessments/${unref(route).params.id}/edit`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Edit`);
          } else {
            return [
              createTextVNode("Edit")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-lucide-arrow-left",
        size: "lg",
        onClick: ($event) => unref(router).push("/assessments")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Back`);
          } else {
            return [
              createTextVNode("Back")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(pending)) {
        _push(`<div class="flex justify-center py-12">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-2",
          class: "animate-spin h-8 w-8 text-gray-400"
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(assessment)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 space-y-6">`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h3 class="text-base font-semibold"${_scopeId}>Assessment Information</h3>`);
            } else {
              return [
                createVNode("h3", { class: "text-base font-semibold" }, "Assessment Information")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4"${_scopeId}><div${_scopeId}><p class="text-sm text-gray-500"${_scopeId}>Assessment #</p><p class="font-medium"${_scopeId}>${ssrInterpolate(unref(assessment).assessmentNumber)}</p></div><div${_scopeId}><p class="text-sm text-gray-500"${_scopeId}>Student</p><p class="font-medium"${_scopeId}>${ssrInterpolate(unref(assessment).student?.firstname)} ${ssrInterpolate(unref(assessment).student?.lastname)}</p></div><div${_scopeId}><p class="text-sm text-gray-500"${_scopeId}>Age</p><p class="font-medium"${_scopeId}>${ssrInterpolate(unref(assessment).student?.age)} years</p></div><div${_scopeId}><p class="text-sm text-gray-500"${_scopeId}>Assessment Date</p><p class="font-medium"${_scopeId}>${ssrInterpolate(new Date(unref(assessment).assessmentDate).toLocaleDateString())}</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-2 md:grid-cols-4 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm text-gray-500" }, "Assessment #"),
                    createVNode("p", { class: "font-medium" }, toDisplayString(unref(assessment).assessmentNumber), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm text-gray-500" }, "Student"),
                    createVNode("p", { class: "font-medium" }, toDisplayString(unref(assessment).student?.firstname) + " " + toDisplayString(unref(assessment).student?.lastname), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm text-gray-500" }, "Age"),
                    createVNode("p", { class: "font-medium" }, toDisplayString(unref(assessment).student?.age) + " years", 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm text-gray-500" }, "Assessment Date"),
                    createVNode("p", { class: "font-medium" }, toDisplayString(new Date(unref(assessment).assessmentDate).toLocaleDateString()), 1)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h3 class="text-base font-semibold"${_scopeId}>Current Assessment Scores</h3>`);
            } else {
              return [
                createVNode("h3", { class: "text-base font-semibold" }, "Current Assessment Scores")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UTable, {
                data: unref(questionScoresList),
                columns: [
                  { accessorKey: "index", header: "#" },
                  { accessorKey: "questionText", header: "Question" },
                  { accessorKey: "score", header: "Score", cell: ({ row }) => h("span", { class: "font-medium" }, row.original.score) },
                  { accessorKey: "level", header: "Level", cell: ({ row }) => h("span", { class: `px-2 py-1 rounded-full text-xs ${getLevelClass(row.original.level)}` }, row.original.level) },
                  { accessorKey: "comment", header: "Comments" }
                ]
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UTable, {
                  data: unref(questionScoresList),
                  columns: [
                    { accessorKey: "index", header: "#" },
                    { accessorKey: "questionText", header: "Question" },
                    { accessorKey: "score", header: "Score", cell: ({ row }) => h("span", { class: "font-medium" }, row.original.score) },
                    { accessorKey: "level", header: "Level", cell: ({ row }) => h("span", { class: `px-2 py-1 rounded-full text-xs ${getLevelClass(row.original.level)}` }, row.original.level) },
                    { accessorKey: "comment", header: "Comments" }
                  ]
                }, null, 8, ["data", "columns"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="space-y-6">`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center justify-between"${_scopeId}><h3 class="text-base font-semibold"${_scopeId}>Child Development Profile</h3><span class="${ssrRenderClass(["px-2 py-1 rounded-full text-sm", getLevelClass(unref(assessment).overallLevel)])}"${_scopeId}>${ssrInterpolate(unref(assessment).overallLevel)}</span></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("h3", { class: "text-base font-semibold" }, "Child Development Profile"),
                  createVNode("span", {
                    class: ["px-2 py-1 rounded-full text-sm", getLevelClass(unref(assessment).overallLevel)]
                  }, toDisplayString(unref(assessment).overallLevel), 3)
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-center mb-4"${_scopeId}><p class="text-sm text-gray-500"${_scopeId}>Overall Score</p><p class="text-4xl font-bold text-violet-600"${_scopeId}>${ssrInterpolate(unref(assessment).overallScore?.toFixed(2))}</p></div>`);
              if (unref(chartData)) {
                _push2(`<div class="aspect-square"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Radar), {
                  data: unref(chartData),
                  options: unref(chartOptions)
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("div", { class: "text-center mb-4" }, [
                  createVNode("p", { class: "text-sm text-gray-500" }, "Overall Score"),
                  createVNode("p", { class: "text-4xl font-bold text-violet-600" }, toDisplayString(unref(assessment).overallScore?.toFixed(2)), 1)
                ]),
                unref(chartData) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "aspect-square"
                }, [
                  createVNode(unref(Radar), {
                    data: unref(chartData),
                    options: unref(chartOptions)
                  }, null, 8, ["data", "options"])
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/assessments/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DVUVsFSL.mjs.map
