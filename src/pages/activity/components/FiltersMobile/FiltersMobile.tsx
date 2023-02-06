import React, { useState } from 'react';
import { StyledCloseButton, StyledContent } from './FiltersMobile.styled';
import Box from '@mui/material/Box';
import Button from 'components/Button/Button';
import Stack from '@mui/material/Stack';
import { CloseIcon } from 'theme/icons';
import TypesFilter from '../TypesFilter/TypesFilter';
import CollectionFilter from '../CollectionFilter/CollectionFilter';
import Modal from '@mui/material/Modal';
import FiltersHeader from '../FiltersHeader/FiltersHeader';
import { FiltersComponentProps } from '../Activity/Activity';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import getLiveCollections from 'utils/getLiveCollections';

const FiltersMobile: React.FC<FiltersComponentProps> = ({
  selectedType,
  setSelectedType,
  selectedContractAddress,
  handleSelectType,
  handleContractAddressUpdate,
  types,
  resetFilters,
  setSelectedContractAddress,
  loading,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const { collections } = useSelector((state: State) => state.collections);

  const liveCollections = getLiveCollections(collections);

  const selectedTypeDetails = types.find((type) => type.value == selectedType);

  const showResetButton =
    selectedType !== 'all' || selectedContractAddress !== 'all';

  const handleSave = () => {
    handleContractAddressUpdate(selectedContractAddress);
    handleSelectType(selectedType);
    setOpenModal(false);
    window.scroll(0, 0);
  };

  const getButtonText = () => {
    if (selectedType !== 'all' && selectedContractAddress !== 'all') {
      return 'Filters (2)';
    } else if (selectedContractAddress !== 'all') {
      const collection = liveCollections.find(
        (collection) =>
          collection.nftContractAddress === selectedContractAddress
      );
      return `Filters: ${collection?.title || ''}`;
    } else {
      return `Filters: ${selectedTypeDetails?.label || ''}`;
    }
  };

  return (
    <>
      {!loading && (
        <Box
          position="fixed"
          bottom={32}
          left={0}
          width="100%"
          px={2}
          sx={{ zIndex: '1000 !important' }}
        >
          <Button
            variant="contained"
            color="primary"
            type="button"
            fullWidth
            onClick={() => setOpenModal(true)}
          >
            {getButtonText()}
          </Button>
        </Box>
      )}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ display: 'flex', flex: '1 !important' }}
        disableEnforceFocus={true}
        disableRestoreFocus={true}
      >
        <StyledContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <FiltersHeader
              showResetButton={showResetButton}
              resetFilters={resetFilters}
            />
            <StyledCloseButton onClick={() => setOpenModal(false)}>
              <CloseIcon sx={{ fontSize: 24 }} />
            </StyledCloseButton>
          </Stack>
          <TypesFilter
            types={types}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
          <CollectionFilter
            selectedContractAddress={selectedContractAddress}
            setSelectedContractAddress={setSelectedContractAddress}
          />
          <Button
            variant="contained"
            color="primary"
            type="button"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleSave}
          >
            Save
          </Button>
        </StyledContent>
      </Modal>
    </>
  );
};

export default FiltersMobile;
