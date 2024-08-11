"use client"

import ConditionalComponent from "@/components/ConditionalComponent"
import Fallback from "@/components/Fallback"
import queryClient from "@/lib/appClient"
import StyledComponentsRegistry from "@/lib/registry"
import GlobalStyles from "@/styles/GlobalStyles"
import { antTheme, defaultTheme } from "@/styles/themes"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider } from "antd"
import React, { useEffect, useState } from "react"
import { ThemeProvider } from "styled-components"

interface AppProps {
  Component: React.FC
  pageProps: any
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [demLoaded, setDemLoaded] = useState(false)

  useEffect(() => {
    setDemLoaded(true)
    return () => {
      setDemLoaded(false)
    }
  }, [])

  return (
    <ConditionalComponent condition={demLoaded} fallback={<Fallback />}>
      <QueryClientProvider client={queryClient}>
        <StyledComponentsRegistry>
          <GlobalStyles />
          <AntdRegistry>
            <ConfigProvider theme={{ ...antTheme }}>
              <ThemeProvider theme={defaultTheme}>
                <Component {...pageProps} />
              </ThemeProvider>
            </ConfigProvider>
          </AntdRegistry>
        </StyledComponentsRegistry>
      </QueryClientProvider>
    </ConditionalComponent>
  )
}

export default App
