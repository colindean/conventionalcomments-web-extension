export type ProductType = "github-v1" | "github-v2" | "gitlab-v1" | "gitlab-v2";

export interface SelectableItem {
  value: string;
  label: string;
  description: string;
}
