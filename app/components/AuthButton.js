// FILE: app/components/AuthButton.js
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, User, LayoutDashboard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="w-10 h-10 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
      </div>
    );
  }

  if (session) {
    return (
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="rounded-full w-9 h-9 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800"
          >
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={36}
              height={36}
              className="object-cover"
            />
          </motion.button>
        </DropdownMenu.Trigger>
        <AnimatePresence>
          {open && (
            <DropdownMenu.Portal forceMount>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenu.Content
                  align="end"
                  className="mt-2 w-56 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-2 z-[70]"
                >
                  <DropdownMenu.Label className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Signed in as <br />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{session.user.name}</span>
                  </DropdownMenu.Label>
                  <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  
                  <DropdownMenu.Item asChild>
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    onSelect={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 focus:outline-none cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </motion.div>
            </DropdownMenu.Portal>
          )}
        </AnimatePresence>
      </DropdownMenu.Root>
    );
  }

  return (
    <motion.button
      onClick={() => signIn('google')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all font-medium text-sm"
    >
      <LogIn className="h-4 w-4" />
      Sign In
    </motion.button>
  );
}
