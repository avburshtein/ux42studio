import React from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Badge,
  Container,
  Heading,
  Text,
  Spacer,
} from './index';

/**
 * UI Kit Examples
 * Демонстрация всех компонентов UI Kit
 */
export const UIKitExamples: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-[64px]">
      <Container maxWidth="xl">
        {/* Heading */}
        <Heading level="h1" font="poppins" className="text-center mb-[16px]">
          UI Kit Examples
        </Heading>
        <Text size="lg" color="secondary" className="text-center mb-[64px]">
          Демонстрация всех компонентов дизайн-системы
        </Text>

        {/* Buttons Section */}
        <section className="mb-[96px]">
          <Heading level="h2" className="mb-[32px]">
            Кнопки
          </Heading>
          
          <Card shadow="md" padding="lg">
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Различные варианты кнопок</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-[16px] mb-[24px]">
                <Button variant="primary" size="lg">
                  Primary Large
                </Button>
                <Button variant="primary" size="md">
                  Primary Medium
                </Button>
                <Button variant="primary" size="sm">
                  Primary Small
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-[16px] mb-[24px]">
                <Button variant="secondary" size="lg">
                  Secondary Large
                </Button>
                <Button variant="secondary" size="md">
                  Secondary Medium
                </Button>
                <Button variant="secondary" size="sm">
                  Secondary Small
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-[16px] mb-[24px]">
                <Button variant="ghost" size="md">
                  Ghost Button
                </Button>
                <Button variant="link" size="md">
                  Link Button
                </Button>
                <Button variant="primary" size="md" disabled>
                  Disabled Button
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-[96px]">
          <Heading level="h2" className="mb-[32px]">
            Карточки
          </Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            <Card shadow="sm" padding="md">
              <CardHeader>
                <CardTitle>Small Shadow</CardTitle>
                <CardDescription>Карточка с минимальной тенью</CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="sm" color="secondary">
                  Используется для второстепенных элементов
                </Text>
              </CardContent>
            </Card>

            <Card shadow="md" padding="md" hover="scale">
              <CardHeader>
                <CardTitle>Medium Shadow</CardTitle>
                <CardDescription>Стандартная карточка с hover</CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="sm" color="secondary">
                  Наведите курсор для просмотра эффекта
                </Text>
              </CardContent>
            </Card>

            <Card shadow="lg" padding="lg" hover="both">
              <CardHeader>
                <CardTitle>Large Shadow</CardTitle>
                <CardDescription>Карточка с крупной тенью</CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="sm" color="secondary">
                  Используется для важных элементов
                </Text>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className="mb-[96px]">
          <Heading level="h2" className="mb-[32px]">
            Элементы форм
          </Heading>
          
          <Card shadow="md" padding="lg">
            <CardHeader>
              <CardTitle>Contact Form Example</CardTitle>
              <CardDescription>Пример формы обратной связи</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-[24px]">
                <div>
                  <label className="block mb-[8px] font-['Inter:Medium',sans-serif]">
                    Name
                  </label>
                  <Input 
                    variant="default" 
                    size="md" 
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block mb-[8px] font-['Inter:Medium',sans-serif]">
                    Email
                  </label>
                  <Input 
                    variant="filled" 
                    size="md" 
                    type="email"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block mb-[8px] font-['Inter:Medium',sans-serif]">
                    Message
                  </label>
                  <Textarea 
                    variant="default" 
                    size="md" 
                    rows={6}
                    placeholder="Tell us about your project..."
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button variant="primary" size="lg">
                Send Message
              </Button>
              <Button variant="ghost" size="lg">
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Badges Section */}
        <section className="mb-[96px]">
          <Heading level="h2" className="mb-[32px]">
            Метки и теги
          </Heading>
          
          <Card shadow="md" padding="lg">
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>Различные варианты меток</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-[24px]">
                <Text size="sm" color="muted" className="mb-[8px]">
                  Primary (gradient):
                </Text>
                <div className="flex flex-wrap gap-[8px]">
                  <Badge variant="primary" size="sm">React</Badge>
                  <Badge variant="primary" size="sm">TypeScript</Badge>
                  <Badge variant="primary" size="sm">Tailwind</Badge>
                </div>
              </div>

              <div className="mb-[24px]">
                <Text size="sm" color="muted" className="mb-[8px]">
                  Secondary (outline):
                </Text>
                <div className="flex flex-wrap gap-[8px]">
                  <Badge variant="secondary" size="md">New</Badge>
                  <Badge variant="secondary" size="md">Featured</Badge>
                  <Badge variant="secondary" size="md">Popular</Badge>
                </div>
              </div>

              <div>
                <Text size="sm" color="muted" className="mb-[8px]">
                  Ghost & Outline:
                </Text>
                <div className="flex flex-wrap gap-[8px]">
                  <Badge variant="ghost" size="md">In Progress</Badge>
                  <Badge variant="outline" size="md">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Typography Section */}
        <section className="mb-[96px]">
          <Heading level="h2" className="mb-[32px]">
            Типографика
          </Heading>
          
          <Card shadow="md" padding="lg">
            <CardHeader>
              <CardTitle>Typography Examples</CardTitle>
              <CardDescription>Заголовки и текст</CardDescription>
            </CardHeader>
            <CardContent className="space-y-[24px]">
              <div>
                <Heading level="h1" font="poppins">
                  Heading 1 (Poppins)
                </Heading>
                <Text size="sm" color="muted">
                  48px-64px responsive
                </Text>
              </div>

              <div>
                <Heading level="h2" font="inter">
                  Heading 2 (Inter)
                </Heading>
                <Text size="sm" color="muted">
                  36px-48px responsive
                </Text>
              </div>

              <div>
                <Heading level="h3">
                  Heading 3
                </Heading>
                <Text size="sm" color="muted">
                  28px-36px responsive
                </Text>
              </div>

              <Spacer size="lg" />

              <div>
                <Text size="xl" color="primary">
                  Extra large text (20-24px)
                </Text>
              </div>

              <div>
                <Text size="lg" color="primary">
                  Large text (18-20px)
                </Text>
              </div>

              <div>
                <Text size="base" color="secondary">
                  Base text with secondary color (16px)
                </Text>
              </div>

              <div>
                <Text size="sm" color="muted">
                  Small muted text (14px)
                </Text>
              </div>

              <div>
                <Text size="xs" color="muted">
                  Extra small text (12px)
                </Text>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Spacer Section */}
        <section className="mb-[96px]">
          <Heading level="h2" className="mb-[32px]">
            Отступы
          </Heading>
          
          <Card shadow="md" padding="lg">
            <CardHeader>
              <CardTitle>Spacer Component</CardTitle>
              <CardDescription>Создание отступов между элементами</CardDescription>
            </CardHeader>
            <CardContent>
              <Text>Element 1</Text>
              <Spacer size="xs" />
              <Text color="muted">8px spacing</Text>
              
              <Spacer size="sm" />
              <Text>Element 2</Text>
              <Spacer size="md" />
              <Text color="muted">24px spacing</Text>
              
              <Spacer size="lg" />
              <Text>Element 3</Text>
              <Spacer size="xl" />
              <Text color="muted">48px spacing</Text>
              
              <Spacer size="2xl" />
              <Text>Element 4</Text>
            </CardContent>
          </Card>
        </section>

        {/* Container Section */}
        <section>
          <Heading level="h2" className="mb-[32px]">
            Контейнеры
          </Heading>
          
          <Card shadow="md" padding="lg">
            <CardHeader>
              <CardTitle>Container Widths</CardTitle>
              <CardDescription>Различные максимальные ширины</CardDescription>
            </CardHeader>
            <CardContent className="space-y-[16px]">
              <Container maxWidth="sm" className="bg-green-100 dark:bg-green-900 p-[16px] rounded-[8px]">
                <Text size="sm" className="text-center">Small (600px)</Text>
              </Container>
              
              <Container maxWidth="md" className="bg-blue-100 dark:bg-blue-900 p-[16px] rounded-[8px]">
                <Text size="sm" className="text-center">Medium (900px)</Text>
              </Container>
              
              <Container maxWidth="lg" className="bg-purple-100 dark:bg-purple-900 p-[16px] rounded-[8px]">
                <Text size="sm" className="text-center">Large (1200px)</Text>
              </Container>
              
              <Container maxWidth="xl" className="bg-orange-100 dark:bg-orange-900 p-[16px] rounded-[8px]">
                <Text size="sm" className="text-center">Extra Large (1400px) - Default</Text>
              </Container>
            </CardContent>
          </Card>
        </section>
      </Container>
    </div>
  );
};

export default UIKitExamples;
