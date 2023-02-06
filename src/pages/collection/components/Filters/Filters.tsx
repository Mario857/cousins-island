import { TokensQuery } from 'utils/blockchain/blockchain.interface';
import TraitsFilters from './TraitsFilters';
import { useMediaQuery } from 'react-responsive';
import OptionsAccordionWrapper from 'components/OptionsAccordion/OptionsAccordionWrapper';
import OptionsAccordion from 'components/OptionsAccordion/OptionsAccordion';

interface FiltersProps {
  query: TokensQuery;
  loading?: boolean;
  traitFilters: any;
  handleFilterToggle: (
    filterName: string,
    filterValue: string,
    isChecked: boolean
  ) => void;
}

const Filters: React.FC<FiltersProps> = ({
  query,
  loading = false,
  traitFilters,
  handleFilterToggle,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 991 });

  const renderTraitFilters = () => (
    <TraitsFilters
      traitFilters={traitFilters}
      query={query}
      handleFilterToggle={handleFilterToggle}
      loading={loading}
    />
  );

  return (
    <OptionsAccordionWrapper>
      {/* <FilterAccordion name="Status">
        <StatusFilter />
      </FilterAccordion>
      <FilterAccordion name="Price">
        <PriceFilter />
      </FilterAccordion> */}
      {isMobile ? (
        <OptionsAccordion
          scrollbar={false}
          heading="Traits"
          defaultExpanded={!isMobile}
        >
          {renderTraitFilters()}
        </OptionsAccordion>
      ) : (
        renderTraitFilters()
      )}
    </OptionsAccordionWrapper>
  );
};

export default Filters;
