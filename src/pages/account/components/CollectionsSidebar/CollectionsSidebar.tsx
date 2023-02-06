import AccordionOption from 'components/OptionsAccordion/AccordionOption';
import OptionsAccordion from 'components/OptionsAccordion/OptionsAccordion';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Radio from 'components/Radio/Radio';
import OptionsAccordionWrapper from 'components/OptionsAccordion/OptionsAccordionWrapper';
import { useMediaQuery } from 'react-responsive';
import { NFTCollectionDetails } from 'utils/blockchain/blockchain.interface';

interface CollectionsSidebarProps {
  collections: NFTCollectionDetails[] | null;
  tokensCount: {
    [key: string]: number;
  } | null;
  selectedNftContractAddress: string | null;
  setSelectedNftContractAddress: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({
  collections,
  tokensCount,
  selectedNftContractAddress,
  setSelectedNftContractAddress,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 991 });

  const tokensCountLength = Object.keys(tokensCount || {}).length;

  return (
    <Stack direction="column" spacing={2}>
      {collections && collections.length > 0 && (
        <OptionsAccordionWrapper>
          <OptionsAccordion
            heading="Collection"
            maxHeight={385}
            defaultExpanded={!isMobile}
          >
            {tokensCountLength > 0 ? (
              collections.map((collection, index) => {
                const count = tokensCount?.[collection.nftContractAddress];
                const formattedCount =
                  count || count === 0
                    ? count >= 30
                      ? '>30'
                      : count.toString()
                    : '...';

                if (count && count > 0) {
                  return (
                    <AccordionOption
                      key={`account-collection-${index}`}
                      onClick={() =>
                        setSelectedNftContractAddress(
                          collection.nftContractAddress
                        )
                      }
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="body2" color="text.primary">
                          {collection.title} ({formattedCount})
                        </Typography>
                        <Radio
                          value={collection.nftContractAddress}
                          checked={
                            selectedNftContractAddress ===
                            collection.nftContractAddress
                          }
                        />
                      </Stack>
                    </AccordionOption>
                  );
                }
              })
            ) : (
              <AccordionOption>
                <Typography variant="body2" color="text.primary">
                  No items found
                </Typography>
              </AccordionOption>
            )}
          </OptionsAccordion>
        </OptionsAccordionWrapper>
      )}
    </Stack>
  );
};

export default CollectionsSidebar;
