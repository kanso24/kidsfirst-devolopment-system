import { b as useToast, f as _sfc_main$8, e as _sfc_main$d } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-DknAj2mS.mjs';
import { _ as _sfc_main$2 } from './Input-eL64qsHE.mjs';
import { _ as _sfc_main$3 } from './Table-C-wOHDbx.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$4 } from './Modal-6O6MpCMQ.mjs';
import { _ as _sfc_main$5 } from './FormField-DIh_xn5E.mjs';
import { _ as _sfc_main$6 } from './Textarea-DmsCxcDl.mjs';
import { defineComponent, ref, withAsyncContext, reactive, mergeProps, unref, withCtx, createTextVNode, isRef, createVNode, openBlock, createBlock, createCommentVNode, withModifiers, toDisplayString, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const UButton = _sfc_main$8;
    const toast = useToast();
    const page = ref(1);
    const limit = ref(10);
    const search = ref("");
    const searchInput = ref("");
    const { data, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/students",
      {
        query: { page, limit, search },
        watch: [page, limit, search]
      },
      "$28m7YGMt6d"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const columns = [
      { accessorKey: "firstname", header: "First Name" },
      { accessorKey: "lastname", header: "Last Name" },
      { accessorKey: "age", header: "Age" },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => row.original.phone || "-"
      },
      {
        accessorKey: "createdAt",
        header: "Added",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => h("div", { class: "flex items-center gap-2" }, [
          h(_sfc_main$8, { color: "gray", variant: "ghost", icon: "i-lucide-pencil", size: "sm", onClick: () => openEdit(row.original) }),
          h(_sfc_main$8, { color: "red", variant: "ghost", icon: "i-lucide-trash-2", size: "sm", onClick: () => confirmDelete(row.original) })
        ])
      }
    ];
    const isOpen = ref(false);
    const isConfirmOpen = ref(false);
    const isEditing = ref(false);
    const selectedStudent = ref(null);
    const submitting = ref(false);
    const formState = reactive({
      id: 0,
      firstname: "",
      lastname: "",
      age: null,
      address: "",
      phone: ""
    });
    const onSearch = () => {
      search.value = searchInput.value;
      page.value = 1;
    };
    const openCreate = () => {
      isEditing.value = false;
      formState.id = 0;
      formState.firstname = "";
      formState.lastname = "";
      formState.age = null;
      formState.address = "";
      formState.phone = "";
      isOpen.value = true;
    };
    const openEdit = (row) => {
      isEditing.value = true;
      formState.id = row.id;
      formState.firstname = row.firstname;
      formState.lastname = row.lastname;
      formState.age = row.age;
      formState.address = row.address || "";
      formState.phone = row.phone || "";
      isOpen.value = true;
    };
    const confirmDelete = (row) => {
      selectedStudent.value = row;
      isConfirmOpen.value = true;
    };
    const saveStudent = async () => {
      try {
        submitting.value = true;
        const endpoint = isEditing.value ? `/api/students/${formState.id}` : "/api/students";
        const method = isEditing.value ? "PUT" : "POST";
        await $fetch(endpoint, {
          method,
          body: formState
        });
        toast.add({ title: `Student ${isEditing.value ? "updated" : "created"} successfully`, color: "green" });
        isOpen.value = false;
        refresh();
      } catch (error) {
        toast.add({ title: "Error", description: error.statusMessage || "Failed to save", color: "red" });
      } finally {
        submitting.value = false;
      }
    };
    const deleteStudent = async () => {
      try {
        submitting.value = true;
        await $fetch(`/api/students/${selectedStudent.value.id}`, { method: "DELETE" });
        toast.add({ title: "Student deleted successfully", color: "green" });
        isConfirmOpen.value = false;
        refresh();
      } catch (error) {
        toast.add({ title: "Error", description: error.statusMessage || "Failed to delete", color: "red" });
      } finally {
        submitting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UTable = _sfc_main$3;
      const _component_UPagination = _sfc_main$1$1;
      const _component_UModal = _sfc_main$4;
      const _component_UFormField = _sfc_main$5;
      const _component_UTextarea = _sfc_main$6;
      const _component_UIcon = _sfc_main$d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="sm:flex sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Students</h1><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage student records and information.</p></div><div class="mt-4 sm:ml-4 sm:mt-0">`);
      _push(ssrRenderComponent(unref(UButton), {
        icon: "i-lucide-plus",
        color: "primary",
        onClick: openCreate,
        size: "lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Add Student `);
          } else {
            return [
              createTextVNode(" Add Student ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"${_scopeId}><form class="flex gap-2 w-full max-w-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(searchInput),
              "onUpdate:modelValue": ($event) => isRef(searchInput) ? searchInput.value = $event : null,
              icon: "i-lucide-search",
              placeholder: "Search by name or phone...",
              class: "w-full",
              size: "lg"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(UButton), {
              type: "submit",
              color: "primary",
              variant: "solid",
              size: "lg"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Search`);
                } else {
                  return [
                    createTextVNode("Search")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</form></div>`);
            _push2(ssrRenderComponent(_component_UTable, {
              data: unref(data)?.students || [],
              columns,
              loading: unref(pending)
            }, {
              "empty-state": withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col items-center justify-center py-6 gap-3"${_scopeId2}><span class="italic text-sm text-gray-500"${_scopeId2}>No students found</span>`);
                  if (unref(search)) {
                    _push3(ssrRenderComponent(unref(UButton), {
                      label: "Clear filter",
                      color: "gray",
                      variant: "ghost",
                      onClick: () => {
                        searchInput.value = "";
                        onSearch();
                      }
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex flex-col items-center justify-center py-6 gap-3" }, [
                      createVNode("span", { class: "italic text-sm text-gray-500" }, "No students found"),
                      unref(search) ? (openBlock(), createBlock(unref(UButton), {
                        key: 0,
                        label: "Clear filter",
                        color: "gray",
                        variant: "ghost",
                        onClick: () => {
                          searchInput.value = "";
                          onSearch();
                        }
                      }, null, 8, ["onClick"])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(data)?.total) {
              _push2(`<div class="flex items-center justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"${_scopeId}><span class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}> Showing <span class="font-medium"${_scopeId}>${ssrInterpolate((unref(data).page - 1) * unref(data).limit + 1)}</span> to <span class="font-medium"${_scopeId}>${ssrInterpolate(Math.min(unref(data).page * unref(data).limit, unref(data).total))}</span> of <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(data).total)}</span> results </span>`);
              _push2(ssrRenderComponent(_component_UPagination, {
                modelValue: unref(page),
                "onUpdate:modelValue": ($event) => isRef(page) ? page.value = $event : null,
                "page-count": unref(limit),
                total: unref(data).total
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700" }, [
                createVNode("form", {
                  onSubmit: withModifiers(onSearch, ["prevent"]),
                  class: "flex gap-2 w-full max-w-sm"
                }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(searchInput),
                    "onUpdate:modelValue": ($event) => isRef(searchInput) ? searchInput.value = $event : null,
                    icon: "i-lucide-search",
                    placeholder: "Search by name or phone...",
                    class: "w-full",
                    size: "lg"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(unref(UButton), {
                    type: "submit",
                    color: "primary",
                    variant: "solid",
                    size: "lg"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Search")
                    ]),
                    _: 1
                  })
                ], 32)
              ]),
              createVNode(_component_UTable, {
                data: unref(data)?.students || [],
                columns,
                loading: unref(pending)
              }, {
                "empty-state": withCtx(() => [
                  createVNode("div", { class: "flex flex-col items-center justify-center py-6 gap-3" }, [
                    createVNode("span", { class: "italic text-sm text-gray-500" }, "No students found"),
                    unref(search) ? (openBlock(), createBlock(unref(UButton), {
                      key: 0,
                      label: "Clear filter",
                      color: "gray",
                      variant: "ghost",
                      onClick: () => {
                        searchInput.value = "";
                        onSearch();
                      }
                    }, null, 8, ["onClick"])) : createCommentVNode("", true)
                  ])
                ]),
                _: 1
              }, 8, ["data", "loading"]),
              unref(data)?.total ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex items-center justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
              }, [
                createVNode("span", { class: "text-sm text-gray-500 dark:text-gray-400" }, [
                  createTextVNode(" Showing "),
                  createVNode("span", { class: "font-medium" }, toDisplayString((unref(data).page - 1) * unref(data).limit + 1), 1),
                  createTextVNode(" to "),
                  createVNode("span", { class: "font-medium" }, toDisplayString(Math.min(unref(data).page * unref(data).limit, unref(data).total)), 1),
                  createTextVNode(" of "),
                  createVNode("span", { class: "font-medium" }, toDisplayString(unref(data).total), 1),
                  createTextVNode(" results ")
                ]),
                createVNode(_component_UPagination, {
                  modelValue: unref(page),
                  "onUpdate:modelValue": ($event) => isRef(page) ? page.value = $event : null,
                  "page-count": unref(limit),
                  total: unref(data).total
                }, null, 8, ["modelValue", "onUpdate:modelValue", "page-count", "total"])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(isOpen),
        "onUpdate:open": ($event) => isRef(isOpen) ? isOpen.value = $event : null
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(unref(isEditing) ? "Edit Student" : "Add New Student")}</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-base font-semibold leading-6 text-gray-900 dark:text-white" }, toDisplayString(unref(isEditing) ? "Edit Student" : "Add New Student"), 1)
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4"${_scopeId2}><div class="grid grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "First Name",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(formState).firstname,
                          "onUpdate:modelValue": ($event) => unref(formState).firstname = $event,
                          required: "",
                          size: "lg"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(formState).firstname,
                            "onUpdate:modelValue": ($event) => unref(formState).firstname = $event,
                            required: "",
                            size: "lg"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Last Name",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(formState).lastname,
                          "onUpdate:modelValue": ($event) => unref(formState).lastname = $event,
                          required: "",
                          size: "lg"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(formState).lastname,
                            "onUpdate:modelValue": ($event) => unref(formState).lastname = $event,
                            required: "",
                            size: "lg"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "Age",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(formState).age,
                          "onUpdate:modelValue": ($event) => unref(formState).age = $event,
                          type: "number",
                          required: "",
                          size: "lg"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(formState).age,
                            "onUpdate:modelValue": ($event) => unref(formState).age = $event,
                            type: "number",
                            required: "",
                            size: "lg"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Phone" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(formState).phone,
                          "onUpdate:modelValue": ($event) => unref(formState).phone = $event,
                          size: "lg"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(formState).phone,
                            "onUpdate:modelValue": ($event) => unref(formState).phone = $event,
                            size: "lg"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormField, { label: "Address" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UTextarea, {
                          modelValue: unref(formState).address,
                          "onUpdate:modelValue": ($event) => unref(formState).address = $event,
                          rows: 3
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(formState).address,
                            "onUpdate:modelValue": ($event) => unref(formState).address = $event,
                            rows: 3
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="flex justify-end gap-3 mt-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UButton), {
                    color: "gray",
                    variant: "ghost",
                    size: "lg",
                    onClick: ($event) => isOpen.value = false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Cancel`);
                      } else {
                        return [
                          createTextVNode("Cancel")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(UButton), {
                    type: "submit",
                    color: "primary",
                    loading: unref(submitting),
                    size: "lg"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Save`);
                      } else {
                        return [
                          createTextVNode("Save")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(saveStudent, ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, {
                          label: "First Name",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(formState).firstname,
                              "onUpdate:modelValue": ($event) => unref(formState).firstname = $event,
                              required: "",
                              size: "lg"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, {
                          label: "Last Name",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(formState).lastname,
                              "onUpdate:modelValue": ($event) => unref(formState).lastname = $event,
                              required: "",
                              size: "lg"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormField, {
                          label: "Age",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(formState).age,
                              "onUpdate:modelValue": ($event) => unref(formState).age = $event,
                              type: "number",
                              required: "",
                              size: "lg"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormField, { label: "Phone" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(formState).phone,
                              "onUpdate:modelValue": ($event) => unref(formState).phone = $event,
                              size: "lg"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormField, { label: "Address" }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(formState).address,
                            "onUpdate:modelValue": ($event) => unref(formState).address = $event,
                            rows: 3
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-3 mt-4" }, [
                        createVNode(unref(UButton), {
                          color: "gray",
                          variant: "ghost",
                          size: "lg",
                          onClick: ($event) => isOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(UButton), {
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, { ui: { ring: "", divide: "divide-y divide-gray-100 dark:divide-gray-800" } }, {
                header: withCtx(() => [
                  createVNode("h3", { class: "text-base font-semibold leading-6 text-gray-900 dark:text-white" }, toDisplayString(unref(isEditing) ? "Edit Student" : "Add New Student"), 1)
                ]),
                default: withCtx(() => [
                  createVNode("form", {
                    onSubmit: withModifiers(saveStudent, ["prevent"]),
                    class: "space-y-4"
                  }, [
                    createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, {
                        label: "First Name",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(formState).firstname,
                            "onUpdate:modelValue": ($event) => unref(formState).firstname = $event,
                            required: "",
                            size: "lg"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, {
                        label: "Last Name",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(formState).lastname,
                            "onUpdate:modelValue": ($event) => unref(formState).lastname = $event,
                            required: "",
                            size: "lg"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormField, {
                        label: "Age",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(formState).age,
                            "onUpdate:modelValue": ($event) => unref(formState).age = $event,
                            type: "number",
                            required: "",
                            size: "lg"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormField, { label: "Phone" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(formState).phone,
                            "onUpdate:modelValue": ($event) => unref(formState).phone = $event,
                            size: "lg"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_UFormField, { label: "Address" }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(formState).address,
                          "onUpdate:modelValue": ($event) => unref(formState).address = $event,
                          rows: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex justify-end gap-3 mt-4" }, [
                      createVNode(unref(UButton), {
                        color: "gray",
                        variant: "ghost",
                        size: "lg",
                        onClick: ($event) => isOpen.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(UButton), {
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
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(isConfirmOpen),
        "onUpdate:open": ($event) => isRef(isConfirmOpen) ? isConfirmOpen.value = $event : null
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="p-4 text-center"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-alert-triangle",
                    class: "mx-auto h-12 w-12 text-red-500 mb-4"
                  }, null, _parent3, _scopeId2));
                  _push3(`<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"${_scopeId2}>Delete Student</h3><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId2}> Are you sure you want to delete <strong${_scopeId2}>${ssrInterpolate(unref(selectedStudent)?.firstname)} ${ssrInterpolate(unref(selectedStudent)?.lastname)}</strong>? This action cannot be undone. </p><div class="mt-6 flex justify-center gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UButton), {
                    color: "gray",
                    variant: "ghost",
                    size: "lg",
                    onClick: ($event) => isConfirmOpen.value = false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Cancel`);
                      } else {
                        return [
                          createTextVNode("Cancel")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(UButton), {
                    color: "red",
                    size: "lg",
                    onClick: deleteStudent,
                    loading: unref(submitting)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Delete`);
                      } else {
                        return [
                          createTextVNode("Delete")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "p-4 text-center" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-alert-triangle",
                        class: "mx-auto h-12 w-12 text-red-500 mb-4"
                      }),
                      createVNode("h3", { class: "text-lg font-medium text-gray-900 dark:text-white mb-2" }, "Delete Student"),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, [
                        createTextVNode(" Are you sure you want to delete "),
                        createVNode("strong", null, toDisplayString(unref(selectedStudent)?.firstname) + " " + toDisplayString(unref(selectedStudent)?.lastname), 1),
                        createTextVNode("? This action cannot be undone. ")
                      ]),
                      createVNode("div", { class: "mt-6 flex justify-center gap-3" }, [
                        createVNode(unref(UButton), {
                          color: "gray",
                          variant: "ghost",
                          size: "lg",
                          onClick: ($event) => isConfirmOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(UButton), {
                          color: "red",
                          size: "lg",
                          onClick: deleteStudent,
                          loading: unref(submitting)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Delete")
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                default: withCtx(() => [
                  createVNode("div", { class: "p-4 text-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-alert-triangle",
                      class: "mx-auto h-12 w-12 text-red-500 mb-4"
                    }),
                    createVNode("h3", { class: "text-lg font-medium text-gray-900 dark:text-white mb-2" }, "Delete Student"),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, [
                      createTextVNode(" Are you sure you want to delete "),
                      createVNode("strong", null, toDisplayString(unref(selectedStudent)?.firstname) + " " + toDisplayString(unref(selectedStudent)?.lastname), 1),
                      createTextVNode("? This action cannot be undone. ")
                    ]),
                    createVNode("div", { class: "mt-6 flex justify-center gap-3" }, [
                      createVNode(unref(UButton), {
                        color: "gray",
                        variant: "ghost",
                        size: "lg",
                        onClick: ($event) => isConfirmOpen.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(UButton), {
                        color: "red",
                        size: "lg",
                        onClick: deleteStudent,
                        loading: unref(submitting)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Delete")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/students/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-AH1H_XEh.mjs.map
