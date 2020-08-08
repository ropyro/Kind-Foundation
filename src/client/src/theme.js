import React from 'react';
import ShoppingCart from 'react-feather/dist/icons/shopping-cart';
import ChevronDown from 'react-feather/dist/icons/chevron-down';
import ChevronUp from 'react-feather/dist/icons/chevron-up';
import ChevronRight from 'react-feather/dist/icons/chevron-right';
import User from 'react-feather/dist/icons/user';
import Close from 'react-feather/dist/icons/x';
import LogOut from 'react-feather/dist/icons/log-out';
import Remove from 'react-feather/dist/icons/x-circle';
import ChevronsRight from 'react-feather/dist/icons/chevrons-right';
import ChevronsLeft from 'react-feather/dist/icons/chevrons-left';
import Lock from 'react-feather/dist/icons/lock';
import Trash from 'react-feather/dist/icons/trash-2';
import Check from 'react-feather/dist/icons/check';
import CheckCircle from 'react-feather/dist/icons/check-circle';
import Eye from 'react-feather/dist/icons/eye';
import EyeOff from 'react-feather/dist/icons/eye-off';
import { createTheme } from '@deity/falcon-ui';

export const deityGreenTheme = createTheme({
  colors: {
    primary: '#222222',
    primaryLight: '#95c110',
    black: '#000000'
  },

  fontWeights: {
    bold: 500
  },

  icons: {
    logo: {
      icon: props => (
        <svg {...props} viewBox="0 0 175 239">
          <path
            transform="translate(0 24)"
            d="M110.733 145.16v-38.407L77.47 87.549l-33.262 19.204v38.408l33.262 19.204 33.263-19.204zM76.897 215L0 170.605V81.812l76.897-44.397 33.836 19.203V.29l43.06 24.93v145.383L76.897 215z"
            fill="#A9CF38"
          />
          <path
            transform="translate(0 61)"
            d="M44.209 69.752v.452L.113 44.745 76.898.415l33.837 19.202v50.135L77.47 50.548z"
            fill="#CCDE6E"
          />
          <path transform="translate(110)" fill="#000" mask="url(#f)" d="M.451.001h.565v193.33H.451z" />
          <path transform="translate(89 11)" fill="#000" d="M85.431 50.427L.275 1.262.557.773l85.156 49.164z" />
          <path transform="translate(55 98)" fill="#000" d="M77.694 45.817L.531 1.267l.283-.49 77.162 44.55z" />
        </svg>
      ),
      stroke: 'none',
      css: {
        width: 'auto',
        height: '100%'
      }
    },
    loader: {
      icon: props => (
        <svg viewBox="0 0 50 50" {...props}>
          <path
            d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
            transform="rotate(241.969 25 25)"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      ),
      size: 'xxl',
      stroke: 'transparent',
      fill: 'primaryLight'
    },
    cart: { icon: ShoppingCart },
    user: { icon: User },
    arrowRight: { icon: ChevronRight },
    dropdownArrowDown: {
      icon: ChevronDown,
      size: 'md',
      ml: 'xs'
    },
    dropdownArrowUp: {
      icon: ChevronUp,
      size: 'md',
      ml: 'xs'
    },
    buttonArrowRight: {
      icon: ChevronRight,
      size: 'md',
      ml: 'xs',
      stroke: 'white'
    },
    close: {
      icon: Close,
      css: {
        cursor: 'pointer'
      }
    },
    logOut: { icon: LogOut },
    remove: { icon: Remove },
    nextPage: {
      icon: ChevronsRight,
      stroke: 'black'
    },
    prevPage: {
      icon: ChevronsLeft,
      stroke: 'black'
    },
    lock: { icon: Lock },
    trash: { icon: Trash },
    check: { icon: Check },
    checkCircle: { icon: CheckCircle },
    eye: { icon: Eye },
    eyeOff: { icon: EyeOff }
  },
  keyframes: {
    loader: {
      '0%': {
        transform: 'rotateZ(0)'
      },
      '100%': {
        transform: 'rotateZ(360deg)'
      }
    }
  },
  components: {
    icon: {
      stroke: 'black'
    },

    breadcrumb: {
      css: ({ theme }) => ({
        ':last-child': {
          pointerEvents: 'none',
          fontWeight: theme.fontWeights.bold,
          color: theme.colors.primaryLight,
          '::after': {
            display: 'none'
          }
        }
      })
    },

    navbar: {
      bgFullWidth: 'primary',
      css: {
        zIndex: 2
      }
    },

    sidebar: {
      px: 'sm',
      pt: 'sm',
      boxShadow: 'subtle',
      css: {
        boxSizing: 'border-box',
        width: {
          xs: '80vw',
          sm: 510
        }
      }
    },

    badge: {
      bg: 'primaryLight',
      color: 'black'
    },

    button: {
      px: 'xl',
      height: 'xl',
      bg: 'black',
      css: {
        transitionProperty: 'all',
        textTransform: 'capitalize'
      },

      variants: {
        loader: {
          size: 'xl',
          borderRadius: 'round',
          border: 'bold',
          borderColor: 'primary',
          p: 'none',
          css: props => ({
            animation: `${props.theme.keyframes.loader} .8s linear infinite`,
            borderRightColor: props.theme.colors.white,
            background: 'none',
            fontSize: 0,
            whiteSpace: 'nowrap',
            cursor: 'default',
            overflow: 'hidden',

            ':hover': {
              borderColor: props.theme.colors.primaryLight,
              borderRightColor: props.theme.colors.white
            }
          })
        }
      }
    },

    input: {
      height: 'xl'
    },
    select: {
      height: 'xl'
    },

    label: {
      fontSize: 'xs',
      fontWeight: 'bold'
    }
  }
});

export const globalCss = {
  body: {
    margin: 0
  },
  html: {
    overflowY: 'scroll'
  }
};
