import { VStack } from "@hope-ui/solid"
import { Nav } from "./Nav"
import { Obj } from "./Obj"
import { Readme } from "./Readme"
import { Container } from "./Container"
import { Sidebar } from "./Sidebar"

export const Body = () => {
  return (
    <Container class="home-body-container">
      <VStack
        class="body home-body"
        mt="$1"
        py="$2"
        px="2%"
        minH="auto"
        w="$full"
        gap="$4"
        overflow="hidden"
      >
        <Readme files={["header.md", "top.md", "index.md"]} fromMeta="header" />
        <Nav />
        <Obj />
        <Readme
          files={["readme.md", "footer.md", "bottom.md"]}
          fromMeta="readme"
        />
        <Sidebar />
      </VStack>
    </Container>
  )
}
