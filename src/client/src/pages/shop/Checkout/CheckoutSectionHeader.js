import React from 'react';
import PropTypes from 'prop-types';
import { Box, H2, Button, Summary, Icon } from '@deity/falcon-ui';
import { toGridTemplate } from '@deity/falcon-ecommerce-uikit';

const ignoreClick = ev => ev.preventDefault();

const CheckoutHeaderArea = {
  icon: 'icon',
  title: 'title',
  summary: 'summary',
  button: 'button'
};

const checkoutHeaderLayout = {
  checkoutHeaderLayout: {
    lineHeight: 1,
    display: 'grid',
    gridGap: 'xs',
    // prettier-ignore
    gridTemplate: toGridTemplate([
      ['40px',                  '1fr',                    '1fr',                      '100px'                  ],
      [CheckoutHeaderArea.icon, CheckoutHeaderArea.title, CheckoutHeaderArea.summary, CheckoutHeaderArea.button]
    ])
  }
};

const SectionHeader = ({ complete, open, title, summary, editLabel, onActionClick }) => (
  <Summary onClick={ignoreClick} defaultTheme={checkoutHeaderLayout} css={{ 'summary:after': { display: 'none' } }}>
    {(complete || open) && (
      <Icon
        size="lg"
        gridArea={CheckoutHeaderArea.icon}
        src={complete ? 'check' : 'arrowRight'}
        css={{ cursor: 'default' }}
      />
    )}
    <H2 fontSize="lg" gridArea={CheckoutHeaderArea.title}>
      {title}
    </H2>
    {summary && (
      <Box ml="lg" pt="xs" gridArea={CheckoutHeaderArea.summary}>
        {summary}
      </Box>
    )}
    {complete && (
      <Button gridArea={CheckoutHeaderArea.button} fontSize="xs" onClick={onActionClick}>
        {editLabel}
      </Button>
    )}
  </Summary>
);

SectionHeader.propTypes = {
  complete: PropTypes.bool,
  open: PropTypes.bool,
  title: PropTypes.string,
  summary: PropTypes.shape({}),
  editLabel: PropTypes.string,
  onActionClick: PropTypes.func
};

export default SectionHeader;
