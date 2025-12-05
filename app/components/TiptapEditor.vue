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
    </div>

    <USeparator class="w-full" />

    <EditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { Extension } from '@tiptap/core'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
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

:deep(.ProseMirror) {
  @apply min-h-60 outline-none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  @apply text-gray-400 dark:text-gray-500;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.ProseMirror ul) {
  @apply ml-6 list-disc;
}

:deep(.ProseMirror ol) {
  @apply ml-6 list-decimal;
}

:deep(.ProseMirror li) {
  display: list-item;
}

:deep(.ProseMirror h1) {
  @apply text-3xl font-bold;
}
:deep(.ProseMirror h2) {
  @apply text-2xl font-bold;
}
:deep(.ProseMirror h3) {
  @apply text-xl font-bold;
}

:deep(.ProseMirror h4) {
  @apply text-lg font-bold;
}

:deep(.ProseMirror h5) {
  @apply text-base font-bold;
}

:deep(.ProseMirror h6) {
  @apply text-sm font-bold;
}

:deep(.ProseMirror a) {
  @apply text-blue-600 underline;
}
</style>
