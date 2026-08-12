import type { ComponentProps } from "react"
import { PlusIcon, SendHorizontalIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { PromptInput } from "@/registry/prompt-input/prompt-input"

export function PromptInputDemo(
  props: ComponentProps<typeof PromptInput>
) {
  return (
    <div className="w-full max-w-xl">
      <PromptInput {...props}>
        <InputGroup>
          <InputGroupTextarea placeholder="Ask anything…" aria-label="Prompt" />
          <InputGroupAddon align="block-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<InputGroupButton size="icon-xs" aria-label="Add" />}
              >
                <PlusIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Upload files</DropdownMenuItem>
                  <DropdownMenuItem>Add context</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton
              className="ml-auto"
              size="icon-xs"
              aria-label="Send"
            >
              <SendHorizontalIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </PromptInput>
    </div>
  )
}
