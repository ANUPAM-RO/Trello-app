import { OrganizationList } from "@clerk/nextjs";
const CreateOrganizationpage = () => {
  return (
  <OrganizationList hidePersonal afterSelectOrganizationUrl="/organization/:id" afterCreateOrganizationUrl="/organization/:id"/>
  )
}

export default CreateOrganizationpage
