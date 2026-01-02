<template>
  <div class="border-default flex w-full flex-col rounded-lg border">
    <div class="flex flex-wrap items-center gap-2 p-2 dark:border-gray-700">
      <div class="flex items-center gap-1">
        <UTooltip
          text="Undo"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().undo().run()"
            :disabled="!editor?.can().undo()"
            variant="ghost"
            color="neutral"
            icon="i-lucide-undo"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Redo"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().redo().run()"
            :disabled="!editor?.can().redo()"
            variant="ghost"
            color="neutral"
            icon="i-lucide-redo"
            size="sm"
          />
        </UTooltip>
      </div>
      <USeparator orientation="vertical" class="h-6" />

      <div class="flex items-center gap-1">
        <UTooltip
          text="Decrease Font Size"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="decreaseFontSize"
            variant="ghost"
            color="neutral"
            icon="i-lucide-a-arrow-down"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Increase Font Size"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="increaseFontSize"
            variant="ghost"
            color="neutral"
            icon="i-lucide-a-arrow-up"
            size="sm"
          />
        </UTooltip>
      </div>

      <USeparator orientation="vertical" class="h-6" />

      <div class="flex items-center gap-1">
        <UTooltip
          text="Bullet List"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().toggleBulletList().run()"
            :color="editor?.isActive('bulletList') ? 'primary' : 'neutral'"
            :variant="editor?.isActive('bulletList') ? 'soft' : 'ghost'"
            icon="i-lucide-list"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Ordered List"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().toggleOrderedList().run()"
            :color="editor?.isActive('orderedList') ? 'primary' : 'neutral'"
            :variant="editor?.isActive('orderedList') ? 'soft' : 'ghost'"
            icon="i-lucide-list-ordered"
            size="sm"
          />
        </UTooltip>
      </div>

      <USeparator orientation="vertical" class="h-6" />

      <div class="flex items-center gap-1">
        <UTooltip
          text="Bold"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().toggleBold().run()"
            :color="editor?.isActive('bold') ? 'primary' : 'neutral'"
            :variant="editor?.isActive('bold') ? 'soft' : 'ghost'"
            icon="i-lucide-bold"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Italic"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().toggleItalic().run()"
            :color="editor?.isActive('italic') ? 'primary' : 'neutral'"
            :variant="editor?.isActive('italic') ? 'soft' : 'ghost'"
            icon="i-lucide-italic"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Underline"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().toggleUnderline().run()"
            :color="editor?.isActive('underline') ? 'primary' : 'neutral'"
            :variant="editor?.isActive('underline') ? 'soft' : 'ghost'"
            icon="i-lucide-underline"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Strikethrough"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().toggleStrike().run()"
            :color="editor?.isActive('strike') ? 'primary' : 'neutral'"
            :variant="editor?.isActive('strike') ? 'soft' : 'ghost'"
            icon="i-lucide-strikethrough"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Link"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UPopover :open="isLinkPopoverOpen" @update:open="isLinkPopoverOpen = $event">
            <UButton
              @click="openLinkPopover"
              :color="editor?.isActive('link') ? 'primary' : 'neutral'"
              :variant="editor?.isActive('link') ? 'soft' : 'ghost'"
              icon="i-lucide-link"
              size="sm"
            />
            <template #content>
              <UInput
                type="url"
                placeholder="Enter URL"
                v-model="linkUrl"
                class="w-64 focus:ring-0 focus:outline-none"
                @keyup.enter="updateLink(linkUrl)"
              >
                <template #trailing>
                  <div class="flex items-center gap-2">
                    <UButton
                      size="sm"
                      variant="ghost"
                      color="primary"
                      icon="i-lucide-corner-down-left"
                      @click="updateLink(linkUrl)"
                      :disabled="!linkUrl"
                    />
                    <UButton
                      v-if="editor?.isActive('link')"
                      size="sm"
                      variant="ghost"
                      color="primary"
                      icon="i-lucide-trash"
                      @click="removeLink"
                    />
                  </div>
                </template>
              </UInput>
            </template>
          </UPopover>
        </UTooltip>
      </div>

      <USeparator orientation="vertical" class="h-6" />

      <div class="flex items-center gap-1">
        <UTooltip
          text="Align Left"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().setTextAlign('left').run()"
            :color="editor?.isActive({ textAlign: 'left' }) ? 'primary' : 'neutral'"
            :variant="editor?.isActive({ textAlign: 'left' }) ? 'soft' : 'ghost'"
            icon="i-lucide-text-align-start"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Align Center"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().setTextAlign('center').run()"
            :color="editor?.isActive({ textAlign: 'center' }) ? 'primary' : 'neutral'"
            :variant="editor?.isActive({ textAlign: 'center' }) ? 'soft' : 'ghost'"
            icon="i-lucide-text-align-center"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Align Right"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().setTextAlign('right').run()"
            :color="editor?.isActive({ textAlign: 'right' }) ? 'primary' : 'neutral'"
            :variant="editor?.isActive({ textAlign: 'right' }) ? 'soft' : 'ghost'"
            icon="i-lucide-text-align-end"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Justify"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().setTextAlign('justify').run()"
            :color="editor?.isActive({ textAlign: 'justify' }) ? 'primary' : 'neutral'"
            :variant="editor?.isActive({ textAlign: 'justify' }) ? 'soft' : 'ghost'"
            icon="i-lucide-text-align-justify"
            size="sm"
          />
        </UTooltip>
      </div>

      <USeparator orientation="vertical" class="h-6" />

      <!-- Table Controls -->
      <div class="flex items-center gap-1">
        <UTooltip
          text="Insert Table"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="
              editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            "
            variant="ghost"
            color="neutral"
            icon="i-lucide-table"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Add Column Before"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().addColumnBefore().run()"
            :disabled="!editor?.can().addColumnBefore()"
            variant="ghost"
            color="neutral"
            icon="i-lucide-table-columns-split"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Add Column After"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().addColumnAfter().run()"
            :disabled="!editor?.can().addColumnAfter()"
            variant="ghost"
            color="neutral"
            icon="i-lucide-table-columns-split"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Delete Column"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().deleteColumn().run()"
            :disabled="!editor?.can().deleteColumn()"
            variant="ghost"
            color="neutral"
            icon="i-lucide-trash-2"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Add Row Before"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().addRowBefore().run()"
            :disabled="!editor?.can().addRowBefore()"
            variant="ghost"
            color="neutral"
            icon="i-lucide-table-rows-split"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Add Row After"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().addRowAfter().run()"
            :disabled="!editor?.can().addRowAfter()"
            variant="ghost"
            color="neutral"
            icon="i-lucide-table-rows-split"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Delete Row"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().deleteRow().run()"
            :disabled="!editor?.can().deleteRow()"
            variant="ghost"
            color="neutral"
            icon="i-lucide-trash-2"
            size="sm"
          />
        </UTooltip>

        <UTooltip
          text="Delete Table"
          :content="{
            align: 'center',
            side: 'top',
          }"
          :delay-duration="0"
        >
          <UButton
            @click="editor?.chain().focus().deleteTable().run()"
            :disabled="!editor?.can().deleteTable()"
            variant="ghost"
            color="neutral"
            icon="i-lucide-trash"
            size="sm"
          />
        </UTooltip>
      </div>
    </div>

    <USeparator class="w-full" />

    <EditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { Extension } from '@tiptap/core'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  editorClass?: string
  rootClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const linkUrl = ref('')
const isLinkPopoverOpen = ref(false)

// Create a custom extension for font size
const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run()
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
        },
    }
  },
})

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextStyle,
    FontSize,
    Link.configure({ openOnClick: false }),
    Underline,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  editorProps: {
    attributes: {
      class: [
        'ProseMirror prose prose-sm sm:prose min-h-48 max-h-96 overflow-y-auto max-w-none focus:outline-none p-4',
        props.rootClass,
      ]
        .filter(Boolean)
        .join(' '),
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

const getCurrentFontSize = () => {
  if (!editor.value) return 16

  const { fontSize } = editor.value.getAttributes('textStyle')
  if (fontSize) {
    return parseInt(fontSize)
  }
  return 16
}

const increaseFontSize = () => {
  const currentSize = getCurrentFontSize()
  const newSize = Math.min(currentSize + 2, 72)
  editor.value?.chain().focus().setFontSize(`${newSize}px`).run()
}

const decreaseFontSize = () => {
  const currentSize = getCurrentFontSize()
  const newSize = Math.max(currentSize - 2, 8)
  editor.value?.chain().focus().setFontSize(`${newSize}px`).run()
}

const updateLink = (url: string) => {
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  } else {
    removeLink()
  }
  isLinkPopoverOpen.value = false
}

const removeLink = () => {
  editor.value?.chain().focus().unsetLink().run()
  linkUrl.value = ''
  isLinkPopoverOpen.value = false
}

const openLinkPopover = () => {
  linkUrl.value = editor.value?.getAttributes('link').href || ''
  isLinkPopoverOpen.value = true
}

watch(
  () => props.modelValue,
  (newValue) => {
    const currentContent = editor.value?.getHTML()
    if (newValue !== currentContent && editor.value) {
      editor.value.commands.setContent(newValue)
    }
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
@reference 'tailwindcss'

::deep(.ProseMirror) {
  @apply min-h-60 outline-none;
}

::deep(.ProseMirror p.is-editor-empty:first-child::before) {
  @apply text-gray-400 dark:text-gray-500;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* ====== Paragraphs ====== */
::deep(.ProseMirror p) {
  @apply mb-3; /* equivalent to margin-bottom: 0.75rem */
  line-height: 1.6;
  min-height: 0.75rem;
}

/* ====== Headings ====== */
::deep(.ProseMirror h1) {
  @apply my-6 text-2xl font-bold; /* margin-top:1.5rem, margin-bottom:1rem approximated */
}

::deep(.ProseMirror h2) {
  @apply my-5 text-xl font-semibold; /* margin-top:1.25rem, margin-bottom:0.75rem */
}

::deep(.ProseMirror h3) {
  @apply my-4 text-lg font-semibold; /* margin-top:1rem, margin-bottom:0.5rem */
}

/* ====== Lists ====== */
::deep(.ProseMirror ul) {
  @apply mb-3 ml-5 list-disc; /* margin-left:1.25rem, margin-bottom:0.75rem */
}

::deep(.ProseMirror ol) {
  @apply mb-3 ml-5 list-decimal;
}

::deep(.ProseMirror li) {
  @apply mb-1; /* margin:0.25rem 0 */
  line-height: 1.5;
  display: list-item;
}

/* ====== Line breaks ====== */
::deep(.ProseMirror br) {
  line-height: 1.2;
}

/* ====== Images ====== */
::deep(.ProseMirror img) {
  @apply my-4 block w-full; /* max-width:100%, margin-top/bottom:1rem */
  height: auto;
}

/* ====== Tables ====== */
::deep(.ProseMirror table) {
  @apply my-4 w-full border-collapse;
  table-layout: fixed;
  display: table;
  overflow: hidden;
}

::deep(.ProseMirror th),
::deep(.ProseMirror td) {
  @apply border px-3 py-2 align-top; /* padding:0.5rem 0.75rem */
  min-width: 1em;
  position: relative;
  box-sizing: border-box;
}

::deep(.ProseMirror th) {
  @apply bg-gray-100 text-left font-bold; /* for light mode */
}

/* Dark mode tables */
::deep(.ProseMirror table th),
::deep(.ProseMirror table td) {
  border-color: #d1d5db;
}

.dark ::deep(.ProseMirror table th) {
  background-color: #374151;
}

.dark ::deep(.ProseMirror table th),
.dark ::deep(.ProseMirror table td) {
  border-color: #4b5563;
}

/* Table paragraphs */
::deep(.ProseMirror table p) {
  margin: 0;
}
</style>
