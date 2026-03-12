import { _ as _sfc_main$1 } from './Card-DknAj2mS.mjs';
import { _ as _sfc_main$2 } from './FormField-DIh_xn5E.mjs';
import { _ as _sfc_main$3 } from './Input-eL64qsHE.mjs';
import { _ as _sfc_main$4 } from './Select-B_f1yO5K.mjs';
import { _ as _sfc_main$5 } from './Textarea-DmsCxcDl.mjs';
import { b as useToast, c as useRouter, f as _sfc_main$8 } from './server.mjs';
import { defineComponent, ref, reactive, mergeProps, withCtx, unref, createVNode, createTextVNode, withModifiers, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import 'reka-ui';
import '@vueuse/core';
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
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const router = useRouter();
    const submitting = ref(false);
    const formState = reactive({
      title: "",
      description: "",
      status: "active"
    });
    const questions = ref([]);
    const addQuestion = () => {
      questions.value.push({
        questionText: "",
        description: "",
        minScore: 1,
        maxScore: 3,
        sortOrder: questions.value.length
      });
    };
    const removeQuestion = (index) => {
      questions.value.splice(index, 1);
    };
    const saveGroup = async () => {
      try {
        submitting.value = true;
        const body = {
          ...formState,
          questions: questions.value
        };
        await $fetch("/api/question-groups", {
          method: "POST",
          body
        });
        toast.add({ title: "Question group created successfully", color: "green" });
        router.push("/question-groups");
      } catch (error) {
        toast.add({ title: "Error", description: error.statusMessage || "Failed to save", color: "red" });
      } finally {
        submitting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UFormField = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_USelect = _sfc_main$4;
      const _component_UTextarea = _sfc_main$5;
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="sm:flex sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white"> Add New Question Group </h1><p class="mt-1 text-sm text-gray-500 dark:text-gray-400"> Create a new question group </p></div></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-6"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Title",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(formState).title,
                    "onUpdate:modelValue": ($event) => unref(formState).title = $event,
                    required: "",
                    size: "lg",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(formState).title,
                      "onUpdate:modelValue": ($event) => unref(formState).title = $event,
                      required: "",
                      size: "lg",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Status" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(formState).status,
                    "onUpdate:modelValue": ($event) => unref(formState).status = $event,
                    items: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(formState).status,
                      "onUpdate:modelValue": ($event) => unref(formState).status = $event,
                      items: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Description" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UTextarea, {
                    modelValue: unref(formState).description,
                    "onUpdate:modelValue": ($event) => unref(formState).description = $event,
                    rows: 3,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(formState).description,
                      "onUpdate:modelValue": ($event) => unref(formState).description = $event,
                      rows: 3,
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="border-t pt-6"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><h3 class="text-lg font-medium"${_scopeId}>Questions</h3>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "button",
              size: "lg",
              variant: "outline",
              icon: "i-lucide-plus",
              onClick: addQuestion
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Add Question`);
                } else {
                  return [
                    createTextVNode("Add Question")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><!--[-->`);
            ssrRenderList(unref(questions), (question, index) => {
              _push2(`<div class="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"${_scopeId}><div class="flex items-start justify-between gap-4 mb-3"${_scopeId}><span class="text-sm font-medium"${_scopeId}>Question ${ssrInterpolate(index + 1)}</span>`);
              _push2(ssrRenderComponent(_component_UButton, {
                type: "button",
                size: "xs",
                variant: "ghost",
                color: "error",
                icon: "i-lucide-trash-2",
                onClick: ($event) => removeQuestion(index)
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_component_UFormField, {
                label: "Question Text",
                required: ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: question.questionText,
                      "onUpdate:modelValue": ($event) => question.questionText = $event,
                      required: "",
                      size: "lg",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: question.questionText,
                        "onUpdate:modelValue": ($event) => question.questionText = $event,
                        required: "",
                        size: "lg",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormField, {
                label: "Description",
                class: "mt-3"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UTextarea, {
                      modelValue: question.description,
                      "onUpdate:modelValue": ($event) => question.description = $event,
                      placeholder: "Optional description",
                      size: "lg",
                      class: "w-full"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UTextarea, {
                        modelValue: question.description,
                        "onUpdate:modelValue": ($event) => question.description = $event,
                        placeholder: "Optional description",
                        size: "lg",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<div class="grid grid-cols-6 gap-4 mt-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UFormField, { label: "Min Score" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: question.minScore,
                      "onUpdate:modelValue": ($event) => question.minScore = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      step: "0.5",
                      size: "lg"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: question.minScore,
                        "onUpdate:modelValue": ($event) => question.minScore = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        step: "0.5",
                        size: "lg"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormField, { label: "Max Score" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: question.maxScore,
                      "onUpdate:modelValue": ($event) => question.maxScore = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      step: "0.5",
                      size: "lg"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: question.maxScore,
                        "onUpdate:modelValue": ($event) => question.maxScore = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        step: "0.5",
                        size: "lg"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]-->`);
            if (unref(questions).length === 0) {
              _push2(`<div class="text-center py-8 text-gray-500"${_scopeId}> No questions added yet. Click &quot;Add Question&quot; to add questions. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex justify-end gap-3 pt-4 border-t"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "ghost",
              size: "lg",
              onClick: ($event) => unref(router).push("/question-groups")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Cancel`);
                } else {
                  return [
                    createTextVNode("Cancel")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              loading: unref(submitting),
              size: "lg"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Save`);
                } else {
                  return [
                    createTextVNode("Save")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(saveGroup, ["prevent"]),
                class: "space-y-6"
              }, [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, {
                    label: "Title",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(formState).title,
                        "onUpdate:modelValue": ($event) => unref(formState).title = $event,
                        required: "",
                        size: "lg",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "Status" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(formState).status,
                        "onUpdate:modelValue": ($event) => unref(formState).status = $event,
                        items: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormField, { label: "Description" }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(formState).description,
                        "onUpdate:modelValue": ($event) => unref(formState).description = $event,
                        rows: 3,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "border-t pt-6" }, [
                  createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                    createVNode("h3", { class: "text-lg font-medium" }, "Questions"),
                    createVNode(_component_UButton, {
                      type: "button",
                      size: "lg",
                      variant: "outline",
                      icon: "i-lucide-plus",
                      onClick: addQuestion
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add Question")
                      ]),
                      _: 1
                    })
                  ]),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(questions), (question, index) => {
                    return openBlock(), createBlock("div", {
                      key: index,
                      class: "mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    }, [
                      createVNode("div", { class: "flex items-start justify-between gap-4 mb-3" }, [
                        createVNode("span", { class: "text-sm font-medium" }, "Question " + toDisplayString(index + 1), 1),
                        createVNode(_component_UButton, {
                          type: "button",
                          size: "xs",
                          variant: "ghost",
                          color: "error",
                          icon: "i-lucide-trash-2",
                          onClick: ($event) => removeQuestion(index)
                        }, null, 8, ["onClick"])
                      ]),
                      createVNode(_component_UFormField, {
                        label: "Question Text",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: question.questionText,
                            "onUpdate:modelValue": ($event) => question.questionText = $event,
                            required: "",
                            size: "lg",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_UFormField, {
                        label: "Description",
                        class: "mt-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: question.description,
                            "onUpdate:modelValue": ($event) => question.description = $event,
                            placeholder: "Optional description",
                            size: "lg",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 2
                      }, 1024),
                      createVNode("div", { class: "grid grid-cols-6 gap-4 mt-3" }, [
                        createVNode(_component_UFormField, { label: "Min Score" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: question.minScore,
                              "onUpdate:modelValue": ($event) => question.minScore = $event,
                              modelModifiers: { number: true },
                              type: "number",
                              step: "0.5",
                              size: "lg"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_component_UFormField, { label: "Max Score" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: question.maxScore,
                              "onUpdate:modelValue": ($event) => question.maxScore = $event,
                              modelModifiers: { number: true },
                              type: "number",
                              step: "0.5",
                              size: "lg"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 2
                        }, 1024)
                      ])
                    ]);
                  }), 128)),
                  unref(questions).length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-8 text-gray-500"
                  }, ' No questions added yet. Click "Add Question" to add questions. ')) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex justify-end gap-3 pt-4 border-t" }, [
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    size: "lg",
                    onClick: ($event) => unref(router).push("/question-groups")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Cancel")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: unref(submitting),
                    size: "lg"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Save")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/question-groups/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=new-CxIDMTI-.mjs.map
