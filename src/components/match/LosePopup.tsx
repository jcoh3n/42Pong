import React from 'react';
import { Box, Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { motion } from "framer-motion";

interface LosePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain?: () => void;
}

const LosePopup = ({ isOpen, onClose, onPlayAgain }: LosePopupProps) => {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Content size="3" style={{ maxWidth: 450 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 15 
          }}
        >
          <Flex direction="column" gap="4" align="center" className="py-8">
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [-2, 2, -2]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                repeatType: "reverse"
              }}
            >
              <Heading size="7" className="text-center text-red-600 font-bold">
                😔 You Lose 😔
              </Heading>
            </motion.div>
  
            <Text size="3" color="gray" className="text-center">
              Better luck next time!
            </Text>
  
            <Box className="mt-6 w-full">
              <Flex gap="3" justify="center">
                {onPlayAgain && (
                  <Button size="3" variant="soft" onClick={onPlayAgain}>
                    Play Again
                  </Button>
                )}
                <Button size="3" onClick={onClose}>
                  Return to Menu
                </Button>
              </Flex>
            </Box>
          </Flex>
        </motion.div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default LosePopup; 