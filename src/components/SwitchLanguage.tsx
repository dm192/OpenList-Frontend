import {
  Center,
  ElementType,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  MenuTriggerProps,
  useColorModeValue,
} from "@hope-ui/solid"
import { createSignal, For, onMount, Show } from "solid-js"
import { initialLang, Lang, languages, setCurrentLang } from "~/app/i18n"
// import { TbLanguageHiragana } from "solid-icons/tb";
import { IoLanguageOutline } from "solid-icons/io"
import { Portal } from "solid-js/web"
import { AzureLoadingSpinner } from "./FullLoading"

const [fetchingLang, setFetchingLang] = createSignal(false)

export const SwitchLanguage = <C extends ElementType = "button">(
  props: MenuTriggerProps<C>,
) => {
  const switchLang = async (lang: Lang) => {
    setCurrentLang(lang)
    localStorage.setItem("lang", lang)
  }

  onMount(() => {
    if (!localStorage.getItem("lang")) {
      localStorage.setItem("lang", initialLang)
    }
  })

  return (
    <>
      <Menu>
        <MenuTrigger cursor="pointer" {...props} />
        <MenuContent>
          <For each={languages}>
            {(lang, i) => (
              <MenuItem
                onSelect={() => {
                  switchLang(lang.code)
                }}
              >
                {lang.lang}
              </MenuItem>
            )}
          </For>
        </MenuContent>
      </Menu>
      <Show when={fetchingLang()}>
        <Portal>
          <Center
            h="$full"
            w="$full"
            pos="fixed"
            top={0}
            bg={useColorModeValue("$blackAlpha4", "$whiteAlpha4")()}
            zIndex="9000"
          >
            <AzureLoadingSpinner size="xl" />
          </Center>
        </Portal>
      </Show>
    </>
  )
}

export const SwitchLanguageWhite = () => (
  <SwitchLanguage as={IoLanguageOutline} boxSize="$8" />
)
