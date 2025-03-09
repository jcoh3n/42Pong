// import React from 'react';
// import { AuthProvider } from "@/components/AuthProvider";
// import Protected from "@/components/Protected";
// import Sidebar from "@/components/sidebar/Sidebar";
// import { Theme as RadixTheme, Flex } from "@radix-ui/themes";
// import "@radix-ui/themes/styles.css";

// export default function ThemeLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
  

//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>
//           <RadixTheme accentColor="blue" appearance="dark" grayColor="slate" scaling="100%" radius="medium">
//             <Protected>
// 				<Flex style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
// 					<Sidebar />
// 					<div style={{ width: '100%', height: '100%', padding: '20px', backgroundColor: 'var(--gray-2)', overflow: 'auto' }}>
// 						{children}
// 					</div>
// 				</Flex>
// 			</Protected>
//           </RadixTheme>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
