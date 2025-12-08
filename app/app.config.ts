export default defineAppConfig({
  ui: {
    colors: {
      neutral: 'gray',
    },
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
        size: 'lg',
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
    selectMenu: {
      defaultVariants: {
        size: 'lg',
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
        size: 'lg',
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
        size: 'lg',
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
        size: 'lg',
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
        size: 'lg',
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
        th: 'text-nowrap',
        td: 'text-black',
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
    tooltip: {
      slots: {
        content: 'bg-gray-800 text-white text-sm',
      },
    },
  },
})
