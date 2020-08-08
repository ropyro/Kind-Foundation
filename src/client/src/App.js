import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import { ThemeProvider, Box, Button } from '@deity/falcon-ui';
import ScrollToTop from '@deity/falcon-client/src/components/ScrollToTop';
import { ServiceWorkerRegistrar, ServiceWorker } from '@deity/falcon-service-worker';
import {
  AppLayout,
  Header,
  ProtectedRoute,
  OnlyUnauthenticatedRoute,
  OnlineStatus,
  LocaleProvider,
  SearchProvider,
  Sidebar
} from '@deity/falcon-ecommerce-uikit';
import { ThemeEditor, ThemeEditorState } from '@deity/falcon-theme-editor';
import loadable from 'src/components/loadable';
import { ErrorBoundary } from 'src/components/ErrorBoundary';
import { Footer } from 'src/components/footer';
// import { Header } from 'src/components/header';
import Home from 'src/pages/Home';
import logo from 'src/assets/logo.png';
import DynamicRoute from 'src/pages/DynamicRoute';
import { SidebarContainer } from 'src/pages/shop/components/Sidebar';
import { deityGreenTheme, globalCss } from './theme';

const HeadMetaTags = () => (
  <Helmet defaultTitle="Deity Shop with Blog" titleTemplate="%s | Deity Shop with Blog">
    <meta name="description" content="This is example of Shop with Blog powered by Deity Falcon" />
    <meta name="keywords" content="pwa,reactjs,ecommerce,magento,shop,webshop,deity" />
    <meta name="theme-color" content="#fff" />
    <meta name="format-detection" content="telephone=yes" />
    <meta property="og:title" content="Deity Shop with Blog" />
    <meta property="og:type" content="website" />
    <meta property="og:description" content="This is example of Shop with Blog powered by Deity Falcon" />
    <meta property="og:url" content="/" />
    <meta property="og:image" content={logo} />
    <meta property="og:image:width" content="300" />
    <meta property="og:image:height" content="107" />
  </Helmet>
);

const Account = loadable(() => import(/* webpackChunkName: "account" */ './pages/shop/Account/Account'));
const SignIn = loadable(() => import(/* webpackChunkName: "account/sign-in" */ './pages/account/SignIn'));
const ResetPassword = loadable(() => import(/* webpackChunkName: "shop/resetpassword" */ './pages/shop/ResetPassword'));
const Blog = loadable(() => import(/* webpackChunkName: "blog/blog" */ './pages/blog/Blog'));
const Cart = loadable(() => import(/* webpackChunkName: "shop/cart" */ './pages/shop/Cart'));
const Checkout = loadable(() => import(/* webpackChunkName: "shop/checkout" */ './pages/shop/Checkout'));
const CheckoutConfirmation = loadable(() =>
  import(/* webpackChunkName: "shop/checkout" */ './pages/shop/CheckoutConfirmation')
);
const CheckoutFailure = loadable(() => import(/* webpackChunkName: "shop/checkout" */ './pages/shop/CheckoutFailure'));
const SidebarContents = loadable(() =>
  import(
    /* webpackPrefetch: true, webpackChunkName: "shop/SidebarContents" */ './pages/shop/components/Sidebar/SidebarContents'
  )
);

let ThemeEditorComponent;
// ThemeEditor gets loaded only in dev mode
// condition below helps with tree shaking of unused exports
// so ThemeEditor gets dead code eliminated in production mode
if (process.env.NODE_ENV !== 'production') {
  ThemeEditorComponent = ThemeEditor;
}

const App = () => (
  <ServiceWorkerRegistrar>
    <LocaleProvider>
      <ScrollToTop />
      <ThemeEditorState initial={deityGreenTheme}>
        {props => (
          <SearchProvider>
            <ThemeProvider theme={props.theme} globalCss={globalCss}>
              <HeadMetaTags />
              <AppLayout>
                <ServiceWorker>
                  {({ isWaiting, skipWaiting }) =>
                    isWaiting ? (
                      <Box>
                        Site has updated. To see changes close other tabs or
                        <Button size="ms" p="xs" m="sm" onClick={() => skipWaiting()}>
                          click here
                        </Button>
                      </Box>
                    ) : null
                  }
                </ServiceWorker>

                <Header />
                <OnlineStatus>{({ isOnline }) => !isOnline && <p>you are offline.</p>}</OnlineStatus>

                <ErrorBoundary>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/blog/:page?" component={Blog} />
                    <Route exact path="/cart" component={Cart} />
                    <Route exact path="/checkout" component={Checkout} />
                    <Route exact path="/checkout/confirmation" component={CheckoutConfirmation} />
                    <Route exact path="/checkout/failure" component={CheckoutFailure} />
                    <ProtectedRoute path="/account" component={Account} />
                    <OnlyUnauthenticatedRoute exact path="/sign-in" component={SignIn} />
                    <OnlyUnauthenticatedRoute exact path="/reset-password" component={ResetPassword} />
                    <DynamicRoute />
                  </Switch>
                  <Footer />
                  <SidebarContainer>
                    {sidebarProps => (
                      <Sidebar {...sidebarProps}>
                        <SidebarContents contentType={sidebarProps.contentType} />
                      </Sidebar>
                    )}
                  </SidebarContainer>
                </ErrorBoundary>

              </AppLayout>
            </ThemeProvider>
            {ThemeEditorComponent && <ThemeEditorComponent {...props} side="left" />}
          </SearchProvider>
        )}
      </ThemeEditorState>
    </LocaleProvider>
  </ServiceWorkerRegistrar>
);

export default App;
