import { _ as _sfc_main$1 } from './Card-DknAj2mS.mjs';
import { _ as _sfc_main$2 } from './FormField-DIh_xn5E.mjs';
import { _ as _sfc_main$3 } from './Select-B_f1yO5K.mjs';
import { _ as _sfc_main$4 } from './Input-eL64qsHE.mjs';
import { b as useToast, c as useRouter, f as _sfc_main$8 } from './server.mjs';
import { defineComponent, ref, reactive, withAsyncContext, watch, computed, mergeProps, withCtx, unref, createVNode, isRef, createTextVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Radar } from 'vue-chartjs';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { u as useFetch } from './fetch-Cu8xFSBp.mjs';
import 'reka-ui';
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
import '@vueuse/core';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@vue/shared';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
    const toast = useToast();
    const router = useRouter();
    const students = ref([]);
    const allQuestionGroups = ref([]);
    const submitting = ref(false);
    const selectedGroupIds = ref([]);
    const selectedGroupId = ref(null);
    const formState = reactive({
      studentId: null,
      assessmentDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
    const domainScores = ref({});
    const getScoreOptions = (minScore, maxScore2) => {
      const options = [];
      for (let i = minScore; i <= maxScore2; i++) {
        options.push(i);
      }
      return options;
    };
    const { data: studentsData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/students",
      {
        query: { limit: 1e3 }
      },
      "$GYs30Qkypz"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    students.value = studentsData.value?.students || [];
    const { data: groupsData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/question-groups/active",
      "$6bA9saCwf7"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    if (groupsData.value?.questionGroups) {
      allQuestionGroups.value = groupsData.value.questionGroups;
    }
    const initializeDomainScores = () => {
      domainScores.value = {};
      selectedGroupIds.value.forEach((groupId) => {
        const group = allQuestionGroups.value.find((g) => g.id === groupId);
        if (group) {
          const groupKey = `group_${groupId}`;
          domainScores.value[groupKey] = {
            groupId,
            groupTitle: group.title,
            domain: group.domain,
            score: 2,
            questionGroupId: groupId,
            questionGroup: group,
            questions: group.questions || [],
            questionScores: {}
          };
          group.questions?.forEach((q) => {
            domainScores.value[groupKey].questionScores[q.id] = { score: q.minScore || 1, comment: "" };
          });
        }
      });
    };
    watch(selectedGroupIds, () => {
      initializeDomainScores();
    }, { deep: true });
    const addGroup = () => {
      if (selectedGroupId.value && !selectedGroupIds.value.includes(selectedGroupId.value)) {
        selectedGroupIds.value.push(selectedGroupId.value);
        selectedGroupId.value = null;
      }
    };
    const removeGroup = (groupId) => {
      selectedGroupIds.value = selectedGroupIds.value.filter((id) => id !== groupId);
    };
    const setQuestionScore = (groupKey, questionId, score) => {
      domainScores.value[groupKey].questionScores[questionId].score = score;
    };
    const calculateDomainScore = (groupKey) => {
      const ds = domainScores.value[groupKey];
      if (ds?.questionGroup && ds?.questions?.length > 0) {
        const scores = Object.values(ds.questionScores).map((qs) => qs.score);
        if (scores.length > 0) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          return parseFloat(avg.toFixed(2));
        }
      }
      return ds?.score || 2;
    };
    const getLevel = (score) => {
      const max = maxScore.value || 3;
      const third = max / 3;
      if (score <= third) return "Emerging";
      if (score <= third * 2) return "Developing";
      if (score <= third * 3 - 0.01) return "Proficient";
      return "Advanced";
    };
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
    const getScoreButtonClass = (score, currentScore) => {
      const base = "px-3 py-1.5 rounded-lg text-sm font-medium transition-all";
      if (score === currentScore) {
        return `${base} bg-violet-600 text-white`;
      }
      return `${base} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900`;
    };
    const questionScoresList = computed(() => {
      const list = [];
      Object.values(domainScores.value).forEach((ds) => {
        ds.questions?.forEach((q) => {
          const score = ds.questionScores[q.id]?.score || q.minScore || 1;
          list.push({
            groupTitle: ds.groupTitle,
            questionText: q.questionText,
            score,
            level: getLevel(score)
          });
        });
      });
      return list;
    });
    const overallScore = computed(() => {
      const allScores = questionScoresList.value.map((qs) => qs.score);
      if (allScores.length === 0) return 0;
      return parseFloat((allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2));
    });
    const overallLevel = computed(() => getLevel(overallScore.value));
    const maxScore = computed(() => {
      let max = 3;
      Object.values(domainScores.value).forEach((ds) => {
        ds.questions?.forEach((q) => {
          if (q.maxScore > max) max = q.maxScore;
        });
      });
      return max;
    });
    const chartData = computed(() => {
      const scores = questionScoresList.value.map((qs) => qs.score);
      const labels = questionScoresList.value.map((qs) => qs.questionText.length > 15 ? qs.questionText.substring(0, 15) + "..." : qs.questionText);
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
    const saveAssessment = async () => {
      if (!formState.studentId) {
        toast.add({ title: "Please select a student", color: "red" });
        return;
      }
      if (Object.keys(domainScores.value).length === 0) {
        toast.add({ title: "Please select at least one question group", color: "red" });
        return;
      }
      try {
        submitting.value = true;
        const payload = {
          studentId: formState.studentId,
          assessmentDate: formState.assessmentDate,
          domainScores: Object.values(domainScores.value).map((ds) => {
            const groupKey = `group_${ds.groupId}`;
            const finalScore = ds.questionGroup ? calculateDomainScore(groupKey) : ds.score;
            return {
              domain: ds.domain,
              score: finalScore,
              level: getLevel(finalScore),
              questionGroupId: ds.questionGroupId,
              questionScores: Object.entries(ds.questionScores).map(([qId, qs]) => ({
                questionText: ds.questions.find((q) => q.id.toString() === qId)?.questionText || "",
                score: qs.score,
                comment: qs.comment || ""
              }))
            };
          })
        };
        await $fetch("/api/assessments", {
          method: "POST",
          body: payload
        });
        toast.add({ title: "Assessment saved successfully", color: "green" });
        router.push("/assessments");
      } catch (error) {
        toast.add({ title: "Error", description: error.statusMessage || "Failed to save assessment", color: "red" });
      } finally {
        submitting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UFormField = _sfc_main$2;
      const _component_USelect = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="sm:flex sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">New Assessment</h1><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new assessment for a student.</p></div></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 space-y-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-base font-semibold"${_scopeId}>Student Information</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-base font-semibold" }, "Student Information")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Select Student",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(formState).studentId,
                    "onUpdate:modelValue": ($event) => unref(formState).studentId = $event,
                    items: unref(students).map((s) => ({ label: `${s.firstname} ${s.lastname}`, value: s.id })),
                    placeholder: "Choose a student",
                    class: "w-full",
                    size: "lg"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(formState).studentId,
                      "onUpdate:modelValue": ($event) => unref(formState).studentId = $event,
                      items: unref(students).map((s) => ({ label: `${s.firstname} ${s.lastname}`, value: s.id })),
                      placeholder: "Choose a student",
                      class: "w-full",
                      size: "lg"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Assessment Date",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(formState).assessmentDate,
                    "onUpdate:modelValue": ($event) => unref(formState).assessmentDate = $event,
                    type: "date",
                    size: "lg",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(formState).assessmentDate,
                      "onUpdate:modelValue": ($event) => unref(formState).assessmentDate = $event,
                      type: "date",
                      size: "lg",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Select Question Groups" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(selectedGroupId),
                    "onUpdate:modelValue": ($event) => isRef(selectedGroupId) ? selectedGroupId.value = $event : null,
                    items: unref(allQuestionGroups).map((g) => ({ label: `${g.title}`, value: g.id })),
                    placeholder: "Select a question group",
                    class: "flex-1"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "primary",
                    size: "lg",
                    disabled: !unref(selectedGroupId) || unref(selectedGroupIds).includes(unref(selectedGroupId)),
                    onClick: addGroup
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Select `);
                      } else {
                        return [
                          createTextVNode(" Select ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode(_component_USelect, {
                        modelValue: unref(selectedGroupId),
                        "onUpdate:modelValue": ($event) => isRef(selectedGroupId) ? selectedGroupId.value = $event : null,
                        items: unref(allQuestionGroups).map((g) => ({ label: `${g.title}`, value: g.id })),
                        placeholder: "Select a question group",
                        class: "flex-1"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                      createVNode(_component_UButton, {
                        color: "primary",
                        size: "lg",
                        disabled: !unref(selectedGroupId) || unref(selectedGroupIds).includes(unref(selectedGroupId)),
                        onClick: addGroup
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Select ")
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(selectedGroupIds).length > 0) {
              _push2(`<div class="mt-3 space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(selectedGroupIds), (groupId) => {
                _push2(`<div class="flex items-center justify-between p-3 border border-violet-500 bg-violet-50 dark:bg-violet-900/20 rounded-lg"${_scopeId}><div${_scopeId}><p class="font-medium"${_scopeId}>${ssrInterpolate(unref(allQuestionGroups).find((g) => g.id === groupId)?.title)}</p><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(allQuestionGroups).find((g) => g.id === groupId)?.domain)}</p></div>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  size: "xs",
                  variant: "ghost",
                  color: "red",
                  icon: "i-lucide-x",
                  onClick: ($event) => removeGroup(groupId)
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                createVNode(_component_UFormField, {
                  label: "Select Student",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelect, {
                      modelValue: unref(formState).studentId,
                      "onUpdate:modelValue": ($event) => unref(formState).studentId = $event,
                      items: unref(students).map((s) => ({ label: `${s.firstname} ${s.lastname}`, value: s.id })),
                      placeholder: "Choose a student",
                      class: "w-full",
                      size: "lg"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Assessment Date",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(formState).assessmentDate,
                      "onUpdate:modelValue": ($event) => unref(formState).assessmentDate = $event,
                      type: "date",
                      size: "lg",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { class: "mt-4" }, [
                createVNode(_component_UFormField, { label: "Select Question Groups" }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode(_component_USelect, {
                        modelValue: unref(selectedGroupId),
                        "onUpdate:modelValue": ($event) => isRef(selectedGroupId) ? selectedGroupId.value = $event : null,
                        items: unref(allQuestionGroups).map((g) => ({ label: `${g.title}`, value: g.id })),
                        placeholder: "Select a question group",
                        class: "flex-1"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                      createVNode(_component_UButton, {
                        color: "primary",
                        size: "lg",
                        disabled: !unref(selectedGroupId) || unref(selectedGroupIds).includes(unref(selectedGroupId)),
                        onClick: addGroup
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Select ")
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ])
                  ]),
                  _: 1
                }),
                unref(selectedGroupIds).length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-3 space-y-2"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedGroupIds), (groupId) => {
                    return openBlock(), createBlock("div", {
                      key: groupId,
                      class: "flex items-center justify-between p-3 border border-violet-500 bg-violet-50 dark:bg-violet-900/20 rounded-lg"
                    }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium" }, toDisplayString(unref(allQuestionGroups).find((g) => g.id === groupId)?.title), 1),
                        createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(unref(allQuestionGroups).find((g) => g.id === groupId)?.domain), 1)
                      ]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        variant: "ghost",
                        color: "red",
                        icon: "i-lucide-x",
                        onClick: ($event) => removeGroup(groupId)
                      }, null, 8, ["onClick"])
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (Object.keys(unref(domainScores)).length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(unref(domainScores), (ds, groupKey) => {
          _push(ssrRenderComponent(_component_UCard, { key: groupKey }, {
            header: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center justify-between"${_scopeId}><h3 class="text-base font-semibold"${_scopeId}>${ssrInterpolate(ds.groupTitle)}</h3><span class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(ds.questions?.length || 0)} questions</span></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("h3", { class: "text-base font-semibold" }, toDisplayString(ds.groupTitle), 1),
                    createVNode("span", { class: "text-xs text-gray-500" }, toDisplayString(ds.questions?.length || 0) + " questions", 1)
                  ])
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="space-y-4"${_scopeId}>`);
                if (ds.questions.length > 0) {
                  _push2(`<div class="space-y-3 mb-4"${_scopeId}><!--[-->`);
                  ssrRenderList(ds.questions, (question) => {
                    _push2(`<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"${_scopeId}><div class="flex items-start justify-between gap-4 mb-2"${_scopeId}><p class="text-sm font-medium flex-1"${_scopeId}>${ssrInterpolate(question.questionText)}</p></div>`);
                    if (question.description) {
                      _push2(`<p class="text-xs text-gray-500 mb-3"${_scopeId}>${ssrInterpolate(question.description)}</p>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`<div class="flex flex-wrap gap-2 mb-3"${_scopeId}><!--[-->`);
                    ssrRenderList(getScoreOptions(question.minScore || 1, question.maxScore || 3), (score) => {
                      _push2(`<button class="${ssrRenderClass(getScoreButtonClass(score, ds.questionScores[question.id]?.score))}"${_scopeId}>${ssrInterpolate(score)}</button>`);
                    });
                    _push2(`<!--]--></div>`);
                    _push2(ssrRenderComponent(_component_UInput, {
                      modelValue: ds.questionScores[question.id].comment,
                      "onUpdate:modelValue": ($event) => ds.questionScores[question.id].comment = $event,
                      placeholder: "Comments",
                      class: "w-full",
                      size: "lg"
                    }, null, _parent2, _scopeId));
                    _push2(`</div>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "space-y-4" }, [
                    ds.questions.length > 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-3 mb-4"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(ds.questions, (question) => {
                        return openBlock(), createBlock("div", {
                          key: question.id,
                          class: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        }, [
                          createVNode("div", { class: "flex items-start justify-between gap-4 mb-2" }, [
                            createVNode("p", { class: "text-sm font-medium flex-1" }, toDisplayString(question.questionText), 1)
                          ]),
                          question.description ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-xs text-gray-500 mb-3"
                          }, toDisplayString(question.description), 1)) : createCommentVNode("", true),
                          createVNode("div", { class: "flex flex-wrap gap-2 mb-3" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(getScoreOptions(question.minScore || 1, question.maxScore || 3), (score) => {
                              return openBlock(), createBlock("button", {
                                key: score,
                                class: getScoreButtonClass(score, ds.questionScores[question.id]?.score),
                                onClick: ($event) => setQuestionScore(groupKey, question.id, score)
                              }, toDisplayString(score), 11, ["onClick"]);
                            }), 128))
                          ]),
                          createVNode(_component_UInput, {
                            modelValue: ds.questionScores[question.id].comment,
                            "onUpdate:modelValue": ($event) => ds.questionScores[question.id].comment = $event,
                            placeholder: "Comments",
                            class: "w-full",
                            size: "lg"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-end gap-3">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        size: "lg",
        onClick: ($event) => unref(router).push("/assessments")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Cancel`);
          } else {
            return [
              createTextVNode("Cancel")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        loading: unref(submitting),
        disabled: Object.keys(unref(domainScores)).length === 0,
        size: "lg",
        onClick: saveAssessment
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Save Assessment`);
          } else {
            return [
              createTextVNode("Save Assessment")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_UCard, { class: "sticky top-6" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-base font-semibold"${_scopeId}>Summary Assessment Scores</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-base font-semibold" }, "Summary Assessment Scores")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (Object.keys(unref(domainScores)).length > 0) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><span class="font-semibold"${_scopeId}>Overall Score:</span><div class="flex items-center gap-2"${_scopeId}><span class="text-2xl font-bold"${_scopeId}>${ssrInterpolate(unref(overallScore))}</span><span class="${ssrRenderClass(["px-2 py-1 rounded-full text-sm", getLevelClass(unref(overallLevel))])}"${_scopeId}>${ssrInterpolate(unref(overallLevel))}</span></div></div></div><div${_scopeId}><h4 class="text-sm font-medium mb-2"${_scopeId}>Question Scores</h4><div class="space-y-2 max-h-64 overflow-y-auto"${_scopeId}><!--[-->`);
              ssrRenderList(unref(questionScoresList), (qs, index) => {
                _push2(`<div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"${_scopeId}><div class="flex-1 min-w-0 mr-2"${_scopeId}><p class="text-xs text-gray-500 truncate"${_scopeId}>${ssrInterpolate(qs.groupTitle)}</p><p class="text-sm truncate"${_scopeId}>${ssrInterpolate(qs.questionText)}</p></div><div class="flex items-center gap-2 flex-shrink-0"${_scopeId}><span class="font-medium"${_scopeId}>${ssrInterpolate(qs.score)}</span><span class="${ssrRenderClass(["px-1.5 py-0.5 rounded-full text-xs", getLevelClass(qs.level)])}"${_scopeId}>${ssrInterpolate(qs.level)}</span></div></div>`);
              });
              _push2(`<!--]--></div></div>`);
              if (unref(questionScoresList).length > 0) {
                _push2(`<div${_scopeId}><h4 class="text-sm font-medium mb-2"${_scopeId}>Development Profile</h4><div class="aspect-square"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Radar), {
                  data: unref(chartData),
                  options: unref(chartOptions)
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<div class="text-center py-4 text-gray-500"${_scopeId}> Select question groups to begin </div>`);
            }
          } else {
            return [
              Object.keys(unref(domainScores)).length > 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                createVNode("div", { class: "p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg" }, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "font-semibold" }, "Overall Score:"),
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode("span", { class: "text-2xl font-bold" }, toDisplayString(unref(overallScore)), 1),
                      createVNode("span", {
                        class: ["px-2 py-1 rounded-full text-sm", getLevelClass(unref(overallLevel))]
                      }, toDisplayString(unref(overallLevel)), 3)
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("h4", { class: "text-sm font-medium mb-2" }, "Question Scores"),
                  createVNode("div", { class: "space-y-2 max-h-64 overflow-y-auto" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(questionScoresList), (qs, index) => {
                      return openBlock(), createBlock("div", {
                        key: index,
                        class: "flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                      }, [
                        createVNode("div", { class: "flex-1 min-w-0 mr-2" }, [
                          createVNode("p", { class: "text-xs text-gray-500 truncate" }, toDisplayString(qs.groupTitle), 1),
                          createVNode("p", { class: "text-sm truncate" }, toDisplayString(qs.questionText), 1)
                        ]),
                        createVNode("div", { class: "flex items-center gap-2 flex-shrink-0" }, [
                          createVNode("span", { class: "font-medium" }, toDisplayString(qs.score), 1),
                          createVNode("span", {
                            class: ["px-1.5 py-0.5 rounded-full text-xs", getLevelClass(qs.level)]
                          }, toDisplayString(qs.level), 3)
                        ])
                      ]);
                    }), 128))
                  ])
                ]),
                unref(questionScoresList).length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("h4", { class: "text-sm font-medium mb-2" }, "Development Profile"),
                  createVNode("div", { class: "aspect-square" }, [
                    createVNode(unref(Radar), {
                      data: unref(chartData),
                      options: unref(chartOptions)
                    }, null, 8, ["data", "options"])
                  ])
                ])) : createCommentVNode("", true)
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "text-center py-4 text-gray-500"
              }, " Select question groups to begin "))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/assessments/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=new-CPoP0VZC.mjs.map
