import React from "react"
import { Typography, TypographyProps } from "antd"
import { TextProps } from "antd/es/typography/Text"
import { ParagraphProps } from "antd/es/typography/Paragraph"
import { LinkProps } from "antd/es/typography/Link"
import Linkify from "react-linkify"
import { TitleProps } from "antd/lib/typography/Title"

const { Paragraph, Text, Link, Title } = Typography

interface CustomTextProps extends TextProps {
  align?:
    | "start"
    | "end"
    | "left"
    | "right"
    | "center"
    | "justify"
    | "match-parent"
}

export const CustomText = React.forwardRef<HTMLSpanElement, CustomTextProps>(
  ({ align, ...props }, ref) => {
    return (
      <Text style={{ ...props.style, textAlign: align }} ref={ref} {...props}>
        {props.children}
      </Text>
    )
  }
)

export const CustomLink = React.forwardRef<HTMLElement, LinkProps>(
  ({ target = "_blank", ...props }, ref) => {
    return (
      <Link target={target} {...props} ref={ref}>
        {props.children}
      </Link>
    )
  }
)

export const CustomParagraph = React.forwardRef<HTMLElement, ParagraphProps>(
  (props, ref) => {
    return (
      <Paragraph {...props} ref={ref}>
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <CustomLink key={key} href={decoratedHref}>
              {decoratedText}
            </CustomLink>
          )}
        >
          {props.children}
        </Linkify>
      </Paragraph>
    )
  }
)

export const CustomTitle = React.forwardRef<HTMLElement, TitleProps>(
  ({ level = 3, editable = false, ...props }, ref) => {
    return <Title level={level} editable={editable} {...props} ref={ref} />
  }
)
