import {
  CustomButton,
  CustomCheckbox,
  CustomDivider,
  CustomModal,
  CustomRow,
  CustomSpace,
  CustomTag,
  CustomText,
} from "@/components/custom"
import { Tag } from "@/interfaces/task"
import useTagStore from "@/stores/tagStore"
import { EditOutlined, PlusOutlined } from "@ant-design/icons"
import React, { useState } from "react"
import styled from "styled-components"
import TagForm from "./TagForm"
import ConditionalComponent from "@/components/ConditionalComponent"

const StyledTag = styled(CustomTag)`
  width: 210px !important;
  text-align: center;
`

const TagContainer = styled.div`
  width: 290px;
  max-height: 300px;
  padding: 10px 15px;
  overflow-y: auto;
  align-self: center;
`

interface TagListProps {
  onSelect?: (tag: Tag) => void
  onUnselect?: (tag: Tag) => void
  open: boolean
  onClose: () => void
}

const TagsList: React.FC<TagListProps> = ({
  onSelect,
  open,
  onClose,
  onUnselect,
}) => {
  const [showTagForm, setShowTagForm] = useState(false)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [selectedTag, setSelectedTag] = useState<Tag>()
  const { tags } = useTagStore()

  return (
    <>
      <CustomModal
        width={"350px"}
        open={open}
        onCancel={onClose}
        onOk={onClose}
        cancelButtonProps={{
          style: { display: "none" },
        }}
      >
        <CustomRow justify={"center"} width={"100%"}>
          <CustomDivider>
            <CustomText strong>Etiquetas</CustomText>
          </CustomDivider>
          <TagContainer>
            <CustomSpace size={10} width={"100%"}>
              <CustomButton
                block
                icon={<PlusOutlined />}
                type={"primary"}
                onClick={() => setShowTagForm(true)}
              >
                Crear etiqueta
              </CustomButton>
              {tags?.map((tag) => (
                <CustomSpace direction="horizontal" size={2} align={"center"}>
                  <CustomCheckbox
                    checked={selectedTags.includes(tag.TAG_ID)}
                    onChange={({ target }) => {
                      if (target.checked) {
                        onSelect?.(tag)
                        setSelectedTags((prev) => [...prev, tag.TAG_ID])
                      } else {
                        onUnselect?.(tag)
                        setSelectedTags((prev) =>
                          prev.filter((id) => id !== tag.TAG_ID)
                        )
                      }
                    }}
                  />
                  <StyledTag
                    key={tag.TAG_ID}
                    color={tag.COLOR}
                    onClick={() => {
                      onSelect?.(tag)
                      setSelectedTags((prev) =>
                        prev.includes(tag.TAG_ID)
                          ? prev.filter((id) => id !== tag.TAG_ID)
                          : [...prev, tag.TAG_ID]
                      )
                    }}
                  >
                    <CustomRow justify={"center"}>
                      {tag.NAME.toUpperCase()}
                    </CustomRow>
                  </StyledTag>
                  <CustomButton
                    type={"link"}
                    icon={<EditOutlined />}
                    onClick={() => {
                      setSelectedTag(tag)
                      setShowTagForm(true)
                    }}
                  />
                </CustomSpace>
              ))}
            </CustomSpace>
          </TagContainer>
        </CustomRow>
      </CustomModal>

      <ConditionalComponent condition={showTagForm}>
        <TagForm
          open={showTagForm}
          onClose={() => setShowTagForm(false)}
          tag={selectedTag}
        />
      </ConditionalComponent>
    </>
  )
}

export default TagsList
