"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

const ParallelModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 h-full w-full z-10"
        />
      </AnimatePresence>
      <AnimatePresence>
        <div className="fixed inset-0 grid place-items-center z-[100]">
          <motion.button
            onClick={() => router.back()}
            layout
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.05,
              },
            }}
            className="flex absolute top-4 right-4 items-center justify-center bg-white rounded-full h-6 w-6"
          >
            <X className="h-4 w-4" />
          </motion.button>
          <motion.div className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden">
            {children}
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
};

export default ParallelModal;
