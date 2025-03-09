export default function Theme({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Theme accentColor="blue" appearance="dark" grayColor="slate" scaling="100%" radius="medium">
            <Protected>
				<Flex style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
					<Sidebar />
					<div style={{ width: '100%', height: '100%', padding: '20px', backgroundColor: 'var(--gray-2)', overflow: 'auto' }}>
						{children}
					</div>
				</Flex>
			</Protected>
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
