import React, { useState } from 'react';
import TraitFilter from './TraitFilter';
import { TokensQuery } from 'utils/blockchain/blockchain.interface';
import OptionsAccordion from 'components/OptionsAccordion/OptionsAccordion';

interface TraitsFiltersProps {
  traitFilters: any;
  query: TokensQuery;
  handleFilterToggle: (
    filterName: string,
    filterValue: string,
    isChecked: boolean
  ) => void;
  loading: boolean;
}

const TraitsFilters: React.FC<TraitsFiltersProps> = ({
  traitFilters,
  query,
  handleFilterToggle,
  loading,
}) => {
  const [expandedFilter, setExpandedFilter] = useState<null | string>(null);

  return (
    <>
      {traitFilters &&
        traitFilters.length > 0 &&
        traitFilters.map((filter: any) => (
          <OptionsAccordion
            heading={filter.title}
            key={`trait-filters-${filter.name}`}
            maxHeight={240}
            expanded={expandedFilter === filter.name}
            handleExpand={() =>
              setExpandedFilter(
                expandedFilter && expandedFilter === filter.name
                  ? null
                  : filter.name
              )
            }
          >
            {filter.traits.map((trait: any) => {
              const selectedTraitFilters = query.traitFilters;

              const isChecked: boolean = Boolean(
                selectedTraitFilters &&
                  selectedTraitFilters[filter.name] &&
                  selectedTraitFilters[filter.name].find(
                    (selectedTrait: any) => selectedTrait === trait.value
                  ) !== undefined
              );

              return (
                <TraitFilter
                  key={`trait-filter-${filter.name}-${trait.value}`}
                  name={filter.name}
                  trait={trait}
                  handleToggle={handleFilterToggle}
                  isChecked={isChecked}
                />
              );
            })}
          </OptionsAccordion>
        ))}
    </>
  );
};

export default TraitsFilters;
