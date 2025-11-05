export default defineAppConfig({
  ui: {
    formField: {
      slots: {
        container: 'mt-1 relative w-full',
        labelWrapper: 'mb-1',
      },
    },
    input: {
      defaultVariants: {
        size: 'lg',
      },
      slots: {
        root: 'relative w-full',
      },
      variants: {
        size: {
          xl: {
            base: 'py-2.5  text-base',
          },
        },
      },
    },
    select: {
      defaultVariants: {
        size: 'xl',
      },
      slots: {
        base: 'relative w-full',
      },
      variants: {
        size: {
          xl: {
            base: 'py-2.5  text-base',
          },
        },
      },
    },
    inputTags: {
      defaultVariants: {
        size: 'xl',
      },
      slots: {
        base: 'relative w-full',
      },
      variants: {
        size: {
          xl: {
            base: 'py-2.5  text-base',
          },
        },
      },
    },
    textarea: {
      defaultVariants: {
        size: 'xl',
      },
      slots: {
        root: 'relative w-full',
      },
      variants: {
        size: {
          xl: {
            base: 'py-2.5  text-sm',
          },
        },
      },
    },
    button: {
      defaultVariants: {
        size: 'xl',
      },
      variants: {
        size: {
          xl: {
            base: 'py-2.5',
          },
        },
      },
    },
    inputNumber: {
      defaultVariants: {
        size: 'xl',
      },
      slots: {
        root: 'relative w-full',
      },
      variants: {
        size: {
          xl: 'py-2.5  text-base',
        },
      },
    },
    table: {
      slots: {
        tr: 'hover:bg-gray-100',
      },
    },
    modal: {
      slots: {
        overlay: 'bg-black/60',
      },
    },
    drawer: {
      slots: {
        overlay: 'bg-black/60',
      },
    },
  },
})
