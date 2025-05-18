-- Add sent_by column to kudos_cards table
ALTER TABLE kudos_cards
ADD COLUMN sent_by UUID REFERENCES users (id);

-- Create index for optimizing filtering by sender
CREATE INDEX IF NOT EXISTS kudos_cards_sent_by_idx ON kudos_cards (sent_by);

-- Update existing records to set sent_by equal to created_by for consistency
UPDATE kudos_cards
SET
    sent_by = created_by
WHERE
    sent_by IS NULL;

-- Note: We're making the column nullable so it's not a breaking change
-- for existing data, but new kudos cards will default to having sent_by
-- equal to created_by if not explicitly specified.