import React from 'react';
import { Route } from 'react-router-dom';
import { CartQuery, OpenSidebarMutation, MiniCartIcon } from '@deity/falcon-ecommerce-uikit';
import { Box, H1, FlexLayout } from '@deity/falcon-ui';
import logo from "../assets/kind-logo.svg"

export const Header = ({ children, ...props }) => (
    <Box p="sm" css={{ background: '#fff' }} {...props}>
        <FlexLayout alignItems="center" px="sm">
            <img src={logo} alt="" onClick={() => window.location.reload(false)} />
            <H1 flex="1"></H1>
            <Box>
                <OpenSidebarMutation>
                    {openSidebar => (
                        <CartQuery>
                            {data => (
                                <MiniCartIcon
                                    onClick={() => openSidebar({ variables: { contentType: 'cart' } })}
                                    itemsQty={data.cart ? data.cart.itemsQty : 0}
                                />
                            )}
                        </CartQuery>
                    )}
                </OpenSidebarMutation>
            </Box>
        </FlexLayout>
        {children}
    </Box>
);