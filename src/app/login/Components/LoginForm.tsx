"use client"

import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomAlert,
  CustomButton,
  CustomCheckbox,
  CustomCol,
  CustomDivider,
  CustomForm,
  CustomFormItem,
  CustomInput,
  CustomLayout,
  CustomPasswordInput,
  CustomRow,
  CustomText,
  CustomWatermark,
} from "@/components/custom"
import { formItemLayout } from "@/styles/breakpoints"
import { LoginOutlined } from "@ant-design/icons"
import { FormInstance } from "antd/lib"
import { NextPage } from "next"
import React from "react"
import styled from "styled-components"

const Layout = styled(CustomLayout)`
  height: 100vh;
`

const LoginLogoContainer = styled.div`
  height: 150px;
  margin: 10px 0;

  img {
    height: 100%;
    object-fit: contain;
  }
`

const Divider = styled(CustomDivider)`
  margin-top: 0;
  padding-top: 0;
`

const LoginContainer = styled.div`
  height: 100vh;
  padding: 0 20px;
  box-shadow: -10px 0 10px -5px rgba(0, 0, 0, 0.1);
`

interface LoginFormProps {
  onFinish?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  form: FormInstance
  isFailed?: boolean
}

const LoginForm: NextPage<LoginFormProps> = ({ onFinish, form, isFailed }) => {
  return (
    <Layout>
      <CustomRow justify={"center"}>
        <CustomCol xs={16}>
          <CustomRow justify={"center"}>
            <img width={"60%"} src="/assets/svg/logo 2.svg" alt="Logo" />
          </CustomRow>
        </CustomCol>
        <CustomCol xs={8}>
          <LoginContainer>
            <CustomRow justify={"center"} align={"middle"} height={"100vh"}>
              <CustomCol xs={16}>
                <CustomForm layout="vertical" form={form} {...formItemLayout}>
                  <CustomRow
                    justify={"start"}
                    height={"50%"}
                    style={{ maxHeight: "50%", overflow: "hidden" }}
                  >
                    <CustomCol xs={24}>
                      <LoginLogoContainer>
                        <img width={"100%"} src={"/assets/svg/Text.svg"} />
                      </LoginLogoContainer>
                    </CustomCol>
                    <ConditionalComponent condition={isFailed}>
                      <CustomCol span={24}>
                        <CustomAlert
                          message={"Usuario y/o contraseña incorrectos"}
                          type={"error"}
                          showIcon
                          closable
                        />
                      </CustomCol>
                    </ConditionalComponent>
                    <Divider />
                    <CustomCol span={24}>
                      <CustomFormItem
                        label={"Usuario"}
                        name={"username"}
                        rules={[{ required: true }]}
                      >
                        <CustomInput placeholder="Nombre de usuario" />
                      </CustomFormItem>
                    </CustomCol>

                    <CustomCol span={24}>
                      <CustomFormItem
                        label={"Contraseña"}
                        name={"password"}
                        rules={[{ required: true }]}
                      >
                        <CustomPasswordInput />
                      </CustomFormItem>
                    </CustomCol>

                    <CustomCol span={24}>
                      <CustomRow justify={"space-between"}>
                        <CustomFormItem
                          name={"remember"}
                          valuePropName="checked"
                        >
                          <CustomCheckbox>Recordarme</CustomCheckbox>
                        </CustomFormItem>

                        <CustomFormItem>
                          <CustomButton type={"link"}>
                            Olvide mi contraseña
                          </CustomButton>
                        </CustomFormItem>
                      </CustomRow>
                    </CustomCol>

                    <CustomCol span={24}>
                      <CustomButton
                        block
                        icon={<LoginOutlined />}
                        onClick={onFinish}
                        type="primary"
                      >
                        Iniciar sesión
                      </CustomButton>
                    </CustomCol>
                  </CustomRow>
                </CustomForm>
              </CustomCol>
            </CustomRow>
          </LoginContainer>
        </CustomCol>
      </CustomRow>
    </Layout>
  )
}

export default LoginForm
