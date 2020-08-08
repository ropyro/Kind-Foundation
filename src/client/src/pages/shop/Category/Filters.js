import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Button } from '@deity/falcon-ui';
import {
  FiltersLayout,
  FilterTile,
  SingleFilter,
  ColorFilter,
  MultipleFilter,
  SearchConsumer,
  FilterOperator
} from '@deity/falcon-ecommerce-uikit';

export const Filters = ({ data, ...rest }) => (
  <SearchConsumer>
    {({ state: { filters }, setFilter, removeFilters }) => (
      <FiltersLayout {...rest}>
        {filters.length > 0 && (
          <Button onClick={removeFilters}>
            <T id="filters.clearAll" />
          </Button>
        )}
        {data.map(({ field, title, options, value }) => (
          <FilterTile key={field} title={title} initiallyOpen={value.length > 0}>
            {(() => {
              switch (field) {
                case 'price':
                  return (
                    <SingleFilter
                      options={options}
                      selected={value.join('-')}
                      onChange={x => setFilter(field, x ? x.split('-').slice(0, 2) : [], FilterOperator.equals)}
                    />
                  );
                case 'color': {
                  const colorsMap = {
                    'Deity Green': '#a9cf38',
                    '#a9cf38': 'Deity Green'
                  };
                  const mapColors = x => (colorsMap[x] !== undefined ? colorsMap[x] : x);
                  const getSelected = options.find(option => option.value === value[0]);

                  return (
                    <ColorFilter
                      options={options.map(x => ({ ...x, value: mapColors(x.title) }))}
                      selected={getSelected ? mapColors(getSelected.title) : undefined}
                      onChange={x =>
                        setFilter(
                          field,
                          x ? [options.find(option => option.title === mapColors(x)).value] : [],
                          FilterOperator.equals
                        )
                      }
                    />
                  );
                }
                case 'material':
                  return (
                    <MultipleFilter
                      options={options}
                      selected={value}
                      onChange={x => setFilter(field, x, FilterOperator.equals)}
                    />
                  );
                case 'cat':
                default:
                  return (
                    <SingleFilter
                      options={options}
                      selected={value[0]}
                      onChange={x => setFilter(field, x ? [x] : [], FilterOperator.equals)}
                    />
                  );
              }
            })()}
          </FilterTile>
        ))}
      </FiltersLayout>
    )}
  </SearchConsumer>
);
